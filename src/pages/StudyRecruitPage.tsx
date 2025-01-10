import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import StarIcon from "../assets/icons/StarIcon.png";
import DaumPostcode from "react-daum-postcode";
import { useNavigate } from "react-router-dom";
import { LatLng } from "../types";
import { PostCreateResponse, PostRequest } from "../types/api/post";
import axios from "axios";

const PageContainer = styled.div`
  padding: 50px 100px 50px 100px;
  display: flex;
  background-color: #f6f1fb;
  flex-direction: column;
`;

const Info = styled.div`
  padding: 20px 0px 50px 0px;
  display: flex;
  flex-direction: column;
`;

const Intro = styled.div`
  padding: 20px 0px 50px 0px;
  display: flex;
  flex-direction: column;
`;

const HorizontalLine = styled.div`
  width: 100%;
  height: 2px;
  background-color: #7c8bbe;
  margin: 0px;
`;

const TitleText = styled.p`
  margin: 0px 0px 0px 10px;
  font-size: 24px;
  font-family: "GmarketSans";
  color: #7c8bbe;
`;

const InputWrapper = styled.div`
  flex-direction: column;
  margin: 0px 20px;
`;

const Inputbox = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Input = styled.input`
  margin-top: 5px;
  margin-bottom: 15px;
  padding: 15px;
  border: 3px solid #b3b4dc;
  border-radius: 10px;
  width: 35vw;
  font-size: 18px;
  font-family: "SCDream4", sans-serif;
`;

const TextInput = styled.p`
  flex-direction: column;
  margin: 0px;
  font-size: 18px;
  font-family: "SCDream4";
  color: #b3b4dc;
`;

const Textarea = styled.textarea`
  margin-bottom: 15px;
  padding: 15px;
  border: 3px solid #b3b4dc;
  border-radius: 10px;
  width: 100%;
  height: 450px;
  font-size: 18px;
  font-family: "SCDream4", sans-serif;
  resize: none;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Button = styled.button`
  width: 100px;
  height: 50px;
  border: none;
  border-radius: 10px;
  background-color: #b3b4dc;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  font-family: "SCDream6";
  color: white;
  font-size: 16px;
  cursor: pointer;
`;

const RowWrapper = styled.div`
  flex-direction: row;
  display: flex;
  align-items: center;
`;

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

interface FindAddressProps {
  setAddressObj: React.Dispatch<React.SetStateAction<AddressObj>>;
  setLatLng: React.Dispatch<React.SetStateAction<LatLng>>;
  setFormData: React.Dispatch<React.SetStateAction<PostRequest>>;
}

interface DaumPostcodeData {
  address: string;
  addressType: string;
  bname: string;
  buildingName: string;
}

function FindAddress({ setAddressObj, setLatLng, setFormData }: FindAddressProps) {
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
  }, []);

  // 주소 검색 API를 이용해 주소 찾기
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAOMAP_API_KEY}&libraries=services`;
    document.head.appendChild(script);

    // Kakao Maps API가 로드되면 실행
    script.onload = () => {
      if (window.kakao?.maps?.services && window?.daum) {
        const geocoder = new window.kakao.maps.services.Geocoder();
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
    // @ts-ignore
    <FindAddressButton type="button" onClick={() => window.address.open()}>
      주소 찾기
    </FindAddressButton>
  );
}

const StudyRecruitPage = () => {
  const [addressObj, setAddressObj] = useState<AddressObj>({
    areaAddress: "",
    townAddress: "",
  });

  const [latLng, setLatLng] = useState<LatLng>({
    latitude: null,
    longitude: null,
  });

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  const [formData, setFormData] = useState<PostRequest>({
    userId: userInfo?.userId || 0,
    skill: "",
    place: "",
    latitude: 0,
    longitude: 0,
    progress: "",
    peopleNum: 0,
    deadline: "",
    type: "",
    done: false,
    title: "",
    content: ""
  });

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      if (!latLng.latitude || !latLng.longitude) {
        alert("주소를 선택해주세요.");
        return;
      }
      
      const postData: PostRequest = {
        ...formData,
        latitude: latLng.latitude,
        longitude: latLng.longitude,
        place: addressObj.townAddress,
      }

      await axios.post<PostCreateResponse>(
        `${process.env.REACT_APP_API_URL}/api/post/create`,
        postData
      );

      alert("글이 등록되었습니다.");
      navigate("/");
    } catch (error) {
      alert("글 등록에 실패했습니다.");
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    console.log("Latitude:", latLng.latitude);
    console.log("Longitude:", latLng.longitude);
    // window.location.reload();
  }, [latLng]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'peopleNum' ? Number(value) : value
    }));
  };

  return (
    <PageContainer>
      <RowWrapper>
        <img
          src={StarIcon}
          alt={"Star Icon"}
          style={{ width: "auto", height: "20px" }}
        />
        <TitleText>프로젝트 기본 정보</TitleText>
      </RowWrapper>
      <HorizontalLine />
      <Info>
        <Inputbox>
          <InputWrapper>
            <TextInput>모집 구분</TextInput>
            <Input
              type="text"
              name="type"
              placeholder="스터디와 프로젝트 중 선택해주세요."
              value={formData.type}
              onChange={handleInputChange}
            />
          </InputWrapper>
          <InputWrapper>
            <TextInput>기술 스택</TextInput>
            <Input
              type="text"
              name="skill"
              placeholder="사용되는 기술 스택을 입력해주세요. ex) 리액트, 스프링..."
              value={formData.skill}
              onChange={handleInputChange}
            />
          </InputWrapper>
        </Inputbox>
        <Inputbox>
          <InputWrapper>
            <TextInput>모집 인원</TextInput>
            <Input
              type="text"
              name="peopleNum"
              placeholder="모집 인원 수를 입력해주세요. ex) 3~5"
              value={formData.peopleNum}
              onChange={handleInputChange}
            />
          </InputWrapper>
          <InputWrapper>
            <TextInput>진행 기간</TextInput>
            <Input
              type="text"
              name="progress"
              placeholder="진행 기간을 입력해주세요."
              value={formData.progress}
              onChange={handleInputChange}
            />
          </InputWrapper>
        </Inputbox>
        <Inputbox>
          <InputWrapper>
            <TextInput>진행 장소</TextInput>
            <AddressInput
              type="text"
              id="addressInput"
              name="place"
              placeholder="주소를 입력해주세요."
              value={formData.place}
              onChange={handleInputChange}
            />
            <FindAddress
              setAddressObj={setAddressObj}
              setLatLng={setLatLng}
              setFormData={setFormData}
            />
          </InputWrapper>
          <InputWrapper>
            <TextInput>모집 마감일</TextInput>
            <Input
              type="text"
              name="deadline"
              placeholder="**** - ** - **"
              value={formData.deadline}
              onChange={handleInputChange}
            />
          </InputWrapper>
        </Inputbox>
      </Info>
      <RowWrapper>
        <img
          src={StarIcon}
          alt={"Star Icon"}
          style={{ width: "auto", height: "20px" }}
        />
        <TitleText>프로젝트 소개</TitleText>
      </RowWrapper>
      <HorizontalLine />
      <Intro>
        <TextInput>제목</TextInput>
        <Input
          type="text"
          name="title"
          placeholder="제목을 입력해주세요."
          value={formData.title}
          onChange={handleInputChange}
        />
        <TextInput>내용</TextInput>
        <Textarea
          name="content"
          placeholder="내용을 입력해주세요."
          value={formData.content}
          onChange={handleInputChange}
        />
      </Intro>
      <ButtonContainer>
        <Button onClick={handleSubmit}>글 등록</Button>
      </ButtonContainer>
    </PageContainer>
  );
};

export default StudyRecruitPage;
