import { GetTechStack } from "../../types/api/techstack";
import { axiosInstance } from "./axios";


export const techStackService = {
  getTechStack: () => {
    return axiosInstance.get<GetTechStack>(
      '/api/v1/techStacks'
    );
  }
};

export const mockTechStackService = {
  getTechStack: () => {
    return Promise.resolve({
      data: {
        "status": 200,
        "code": "SUCCESS_GET_TECH_STACK",
        "message": "기술 스택을 성공적으로 불러왔습니다.",
        "data": [
          {
            "id": 1,
            "name": "React",
            "category": "FRONTEND"
          },
          {
            "id": 2,
            "name": "Vue",
            "category": "FRONTEND"
          },
          {
            "id": 3,
            "name": "Angular",
            "category": "FRONTEND"
          },
          {
            "id": 4,
            "name": "HTML/CSS",
            "category": "FRONTEND"
          },
          {
            "id": 5,
            "name": "Spring",
            "category": "BACKEND"
          },
          {
            "id": 6,
            "name": "Spring Boot",
            "category": "BACKEND"
          },
          {
            "id": 7,
            "name": "Node.js",
            "category": "BACKEND"
          },
          {
            "id": 8,
            "name": "Django",
            "category": "BACKEND"
          },
          {
            "id": 9,
            "name": "Swift",
            "category": "MOBILE"
          },
          {
            "id": 10,
            "name": "Kotlin",
            "category": "MOBILE"
          },
          {
            "id": 11,
            "name": "Flutter",
            "category": "MOBILE"
          },
          {
            "id": 12,
            "name": "ReactNative",
            "category": "MOBILE"
          }
        ]
      }
    })
  }
}