import React, { useCallback, useEffect } from "react";
import styled from "styled-components";
import { LatLng } from "../types";
import DaumPostcode from "react-daum-postcode";
import { PostRequest } from "../types/api/post";

const AddressInput = styled.input`
  margin-top: 5px;
  margin-bottom: 15px;
  padding: 15px;
  border: 3px solid #b3b4dc;
  border-radius: 10px;
  width: 28vw;
  font-size: 18px;
  font-family: "SCDream4", sans-serif;
`;

const FindAddressButton = styled.button`
  margin-left: 20px;
  width: 100px;
  height: 50px;
  border: none;
  border-radius: 10px;
  background-color: #b6b6b6;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  font-family: "SCDream6";
  color: white;
  font-size: 16px;
  cursor: pointer;
`;

interface AddressObj {
  areaAddress: string;
  townAddress: string;
}

interface DaumPostcodeData {
  address: string;
  addressType: string;
  bname: string;
  buildingName: string;
}

interface AddressSearchProps {
  addressValue: string;
  setAddressObj: React.Dispatch<React.SetStateAction<AddressObj>>;
  setLatLng: React.Dispatch<React.SetStateAction<LatLng>>;
  setFormData: React.Dispatch<React.SetStateAction<PostRequest>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AddressSearch = ({
  addressValue,
  setAddressObj,
  setLatLng,
  setFormData,
  handleInputChange,
}: AddressSearchProps) => {
  const handleComplete = useCallback((data: DaumPostcodeData) => {
    // 도로명 주소의 노출 규칙에 따라 주소를 표시
    let fullAddress = data.address;
    let extraAddress = "";
    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }

      fullAddress += extraAddress !== "" ? `(${extraAddress})` : "";

      setAddressObj({
        areaAddress: "",
        townAddress: fullAddress,
      });

      setFormData(prev => ({
        ...prev,
        place: fullAddress
      }));

      // 사용자가 입력한 주소 정보를 입력 필드에 넣음
      const addressInput = document.getElementById("addressInput") as HTMLInputElement;
      if (addressInput) {
        addressInput.value = fullAddress;
      }

      // 주소로 좌표를 검색 (Kakao Map API 사용)
      window.kakao.maps.load(() => {
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(fullAddress, (result: any, status: any) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const latitude = parseFloat(result[0].y);
            const longitude = parseFloat(result[0].x);

            setAddressObj({
              areaAddress: "",
              townAddress: fullAddress,
            });

            // 입력받은 주소의 위도, 경도 정보를 state에 저장
            setLatLng({
              latitude,
              longitude,
            })

            const addressInput = document.getElementById("addressInput") as HTMLInputElement;
            if (addressInput) {
              addressInput.value = fullAddress;
            }
          }
        });
      });
    }
  }, [setAddressObj, setFormData, setLatLng]);

  // 주소 검색 API를 이용해 주소 찾기
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAOMAP_API_KEY}&libraries=services`;
    document.head.appendChild(script);

    // Kakao Maps API가 로드되면 실행
    script.onload = () => {
      if (window.kakao?.maps?.services && window?.daum) {
        const address = new window.daum.Postcode({
          oncomplete: handleComplete,
        });
        // @ts-ignore
        window.address = address;
      } else {
        console.error("Failed to load Kakao Maps API");
      }
    };

    script.onerror = () => {
      console.error("Failed to load Kakao Maps SDK script");
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [handleComplete]);

  return (
    <>
      <AddressInput
        type="text"
        id="addressInput"
        name="place"
        placeholder="주소를 입력해주세요."
        value={addressValue}
        onChange={handleInputChange}
      />
      {/* @ts-ignore */}
      <FindAddressButton type="button" onClick={() => window.address.open()}>
        주소 찾기
      </FindAddressButton>
    </>
  )
}