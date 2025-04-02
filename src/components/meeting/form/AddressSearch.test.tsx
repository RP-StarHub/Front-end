import React from 'react';
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { AddressSearch } from "./AddressSearch";
import { AddressObj } from "../../../types/models/meeting";
import { LatLng } from "../../../types/models/common";
import { CreateMeetingRequest } from "../../../types/api/meeting";

const mockSetAddressInfo = jest.fn();
const mockSetLocation = jest.fn();
const mockSetFormData = jest.fn();
const mockHandleInputChange = jest.fn();
const mockAddressOpen = jest.fn();

const ROAD_ADDRESS = "서울특별시 강남구 테헤란로 123";
const LEGAL_DONG = "역삼동";
const BUILDING_NAME = "테헤란타워";

jest.mock("../../common/ui/Button", () => {
  return function MockButton(props: {
    children: React.ReactNode;
    onClick?: () => void;
    "data-testid"?: string;
    type?: "button" | "submit" | "reset";
    variant?: string;
  }) {
    return (
      <button 
        type={props.type} 
        onClick={props.onClick} 
        data-testid={props["data-testid"]}
      >
        {props.children}
      </button>
    );
  };
});

const mockHandleComplete = jest.fn((data) => {
  if (data.addressType !== "R") return;
  
  let fullAddress = data.address;
  let extraAddress = "";

  if (data.bname !== "") {
    extraAddress += data.bname;
  }
  if (data.buildingName !== "") {
    extraAddress +=
      extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
  }

  fullAddress += extraAddress !== "" ? `(${extraAddress})` : "";

  mockSetAddressInfo({
    areaAddress: "",
    townAddress: fullAddress,
  });

  mockSetFormData({
    location: fullAddress
  });

  if (window.kakao?.maps) {
    window.kakao.maps.load(() => {
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(fullAddress, (result: Array<{y: string, x: string}>, status: string) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const latitude = parseFloat(result[0].y);
          const longitude = parseFloat(result[0].x);

          mockSetLocation({
            latitude,
            longitude,
          });
        }
      });
    });
  }
});

describe("AddressSearch 컴포넌트", () => {
  const setup = (props: Partial<{
    addressValue: string;
    setAddressInfo: (addressInfo: AddressObj) => void;
    setLocation: (location: LatLng) => void;
    setFormData: (data: Partial<CreateMeetingRequest>) => void;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
  }> = {}) => {
    const defaultProps = {
      addressValue: "서울시 강남구",
      setAddressInfo: mockSetAddressInfo,
      setLocation: mockSetLocation,
      setFormData: mockSetFormData,
      handleInputChange: mockHandleInputChange,
      error: undefined
    };

    window.kakao = {
      maps: {
        load: jest.fn(cb => cb && cb()),
        services: {
          Geocoder: jest.fn(() => ({
            addressSearch: jest.fn((address, callback) => {
              callback([{ y: "37.123", x: "127.123" }], "OK");
            })
          })),
          Status: { OK: "OK" }
        }
      }
    };

    window.address = { open: mockAddressOpen };

    const utils = render(
      <AddressSearch {...defaultProps} {...props} />
    );

    return {
      getAddressSearch: () => screen.getByTestId("address-search"),
      getAddressInput: () => screen.getByTestId("address-input"),
      getAddressButton: () => screen.getByTestId("address-search-button"),
      simulateAddressSelection: (addressData: {
        address: string;
        addressType: string;
        bname: string;
        buildingName: string;
      }) => {
        mockHandleComplete(addressData);
      },
      ...utils,
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe("UI 렌더링 테스트", () => {
    it("기본 UI 요소들이 올바르게 렌더링되어야 한다", () => {
      // Arrange
      const { getAddressSearch, getAddressInput, getAddressButton } = setup();

      // Assert
      expect(getAddressSearch()).toBeInTheDocument();
      expect(getAddressInput()).toBeInTheDocument();
      expect(getAddressButton()).toBeInTheDocument();
    });

    it("입력 필드에 주소 값이 올바르게 표시되어야 한다", () => {
      // Arrange
      const testAddress = "서울시 강남구 역삼동";
      const { getAddressInput } = setup({ addressValue: testAddress });

      // Assert
      expect(getAddressInput()).toHaveValue(testAddress);
    });

    it("에러가 있는 경우 입력 필드에 에러 스타일이 적용되어야 한다", () => {
      // Arrange
      const errorMessage = "주소를 입력해주세요";
      const { getAddressInput } = setup({ error: errorMessage });

      // Assert
      expect(getAddressInput()).toHaveClass("border-red-500");
    });

    it("readonly 속성이 적용되어야 한다", () => {
      // Arrange
      const { getAddressInput } = setup();

      // Assert
      expect(getAddressInput()).toHaveAttribute("readOnly");
    });
  });

  describe("사용자 동작 테스트", () => {
    it("주소 검색 버튼 클릭 시 window.address.open이 호출되어야 한다", () => {
      // Arrange
      const { getAddressButton } = setup();

      // Act
      fireEvent.click(getAddressButton());

      // Assert
      expect(mockAddressOpen).toHaveBeenCalled();
    });

    it("도로명 주소 선택 시 setAddressInfo가 호출되어야 한다", () => {
      // Arrange
      const { simulateAddressSelection } = setup();

      // Act
      simulateAddressSelection({
        address: ROAD_ADDRESS,
        addressType: "R",
        bname: LEGAL_DONG,
        buildingName: BUILDING_NAME
      });

      // Assert
      expect(mockSetAddressInfo).toHaveBeenCalledWith({
        areaAddress: "",
        townAddress: `${ROAD_ADDRESS}(${LEGAL_DONG}, ${BUILDING_NAME})`
      });
    });

    it("도로명 주소 선택 시 setFormData가 호출되어야 한다", () => {
      // Arrange
      const { simulateAddressSelection } = setup();

      // Act
      simulateAddressSelection({
        address: ROAD_ADDRESS,
        addressType: "R",
        bname: LEGAL_DONG,
        buildingName: BUILDING_NAME
      });

      // Assert
      expect(mockSetFormData).toHaveBeenCalledWith({
        location: `${ROAD_ADDRESS}(${LEGAL_DONG}, ${BUILDING_NAME})`
      });
    });

    it("도로명 주소 선택 시 좌표 정보가 업데이트되어야 한다", () => {
      // Arrange
      const { simulateAddressSelection } = setup();

      // Act
      simulateAddressSelection({
        address: ROAD_ADDRESS,
        addressType: "R",
        bname: LEGAL_DONG,
        buildingName: BUILDING_NAME
      });

      // Assert
      expect(mockSetLocation).toHaveBeenCalledWith({
        latitude: 37.123,
        longitude: 127.123
      });
    });
  });

  describe("에러 케이스 테스트", () => {
    it("window.address가 없어도 오류 없이 동작해야 한다", () => {
      // Arrange
      const { getAddressButton } = setup();
      delete window.address;

      // Act & Assert
      expect(() => {
        fireEvent.click(getAddressButton());
      }).not.toThrow();
    });

    it("지번 주소는 처리하지 않아야 한다", () => {
      // Arrange
      const { simulateAddressSelection } = setup();

      // Act
      simulateAddressSelection({
        address: ROAD_ADDRESS,
        addressType: "J", // 지번 주소 타입
        bname: LEGAL_DONG,
        buildingName: BUILDING_NAME
      });

      // Assert
      expect(mockSetAddressInfo).not.toHaveBeenCalled();
    });

    it("window.kakao가 없어도 오류 없이 동작해야 한다", () => {
      // Arrange
      const { simulateAddressSelection } = setup();
      delete window.kakao;

      // Act & Assert
      expect(() => {
        simulateAddressSelection({
          address: ROAD_ADDRESS,
          addressType: "R",
          bname: LEGAL_DONG,
          buildingName: BUILDING_NAME
        });
      }).not.toThrow();
    });

    it("부가 정보가 없는 경우에도 주소가 올바르게 처리되어야 한다", () => {
      // Arrange
      const { simulateAddressSelection } = setup();

      // Act
      simulateAddressSelection({
        address: ROAD_ADDRESS,
        addressType: "R",
        bname: "",
        buildingName: ""
      });

      // Assert
      expect(mockSetAddressInfo).toHaveBeenCalledWith({
        areaAddress: "",
        townAddress: ROAD_ADDRESS
      });
    });
  });
});