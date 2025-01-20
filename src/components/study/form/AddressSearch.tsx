import React, { useCallback, useEffect } from "react";
import DaumPostcode from "react-daum-postcode";
import TextInput from "../../common/ui/TextInput";
import Button from "../../common/ui/Button";
import { PostRequest } from "../../../types/api/post";
import { AddressObj } from "../../../types/models/study";
import { LatLng } from "../../../types/models/common";

interface DaumPostcodeData {
  address: string;
  addressType: string;
  bname: string;
  buildingName: string;
}

interface AddressSearchProps {
  addressValue: string;
  setAddressInfo: (addressInfo: AddressObj) => void;
  setLocation: (location: LatLng) => void;
  setFormData: (data: Partial<PostRequest>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export const AddressSearch = ({
  addressValue,
  setAddressInfo,
  setLocation,
  setFormData,
  handleInputChange,
  error
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

      setAddressInfo({
        areaAddress: "",
        townAddress: fullAddress,
      });

      setFormData({
        place: fullAddress
      });
      
      // 주소로 좌표를 검색 (Kakao Map API 사용)
      window.kakao.maps.load(() => {
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(fullAddress, (result: any, status: any) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const latitude = parseFloat(result[0].y);
            const longitude = parseFloat(result[0].x);

            setLocation({
              latitude,
              longitude,
            });
          }
        });
      });
    }
  }, [setAddressInfo, setFormData, setLocation]);

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
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <TextInput
          type="text"
          id="addressInput"
          name="place"
          placeholder="주소를 입력해주세요."
          value={addressValue}
          error={error}
          fullWidth
          inputSize="medium"
          onChange={handleInputChange}
        />
      </div>
      <Button
        type="button"
        variant="secondary"
        // @ts-ignore
        onClick={() => window.address?.open()}
      >
        주소 찾기
      </Button>
    </div>
  );
};