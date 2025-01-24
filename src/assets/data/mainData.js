import { DURATION, RecruitmentType } from "../../types/models/meeting";

export const mainData = {
    "status": 200,
    "code": "SUCCESS_GET_MEETING_LIST",
    "message": "모임 목록을 성공적으로 불러왔습니다.",
    "data": {
        "content": [
            {
                "id": 5,
                "title": "ㅎㅇ",
                "recruitmentType": RecruitmentType.STUDY,
                "maxParticipants": 3,
                "duration": DURATION.ONE_WEEK,
                "endDate": "2025-01-31",
                "techStacks": [
                    "GraphQL",
                    "Kafka",
                    "GraphQL",
                    "Kafka"
                ],
                "location": "서울 노원구 동일로207길 186(하계동, 학여울청구아파트)",
                "latitude": 37.64,
                "longitude": 127.06,
                "likeDto": {
                    "likeCount": 0,
                    "isLiked": null
                }
            },
            {
                "id": 4,
                "title": "ㅎㅇ",
                "recruitmentType": RecruitmentType.STUDY,
                "maxParticipants": 3,
                "duration": DURATION.ONE_WEEK,
                "endDate": "2025-01-31",
                "techStacks": [
                    "GraphQL",
                    "Kafka",
                    "GraphQL",
                    "Kafka"
                ],
                "location": "서울 노원구 동일로207길 50(중계동, 시립북부여성발전센타)",
                "latitude": 37.64,
                "longitude": 127.06,
                "likeDto": {
                    "likeCount": 0,
                    "isLiked": null
                }
            },
            {
                "id": 3,
                "title": "ㅎㅇ",
                "recruitmentType": RecruitmentType.STUDY,
                "maxParticipants": 3,
                "duration": DURATION.ONE_WEEK,
                "endDate": "2025-01-31",
                "techStacks": [
                    "GraphQL",
                    "Kafka",
                    "GraphQL",
                    "Kafka"
                ],
                "location": "서울 노원구 동일로207길 140(하계동, 호산나교회)",
                "latitude": 37.64,
                "longitude": 127.06,
                "likeDto": {
                    "likeCount": 0,
                    "isLiked": null
                }
            },
            {
                "id": 2,
                "title": "ㅎㅇ",
                "recruitmentType": RecruitmentType.STUDY,
                "maxParticipants": 3,
                "duration": DURATION.ONE_WEEK,
                "endDate": "2025-01-31",
                "techStacks": [
                    "GraphQL",
                    "Kafka",
                    "GraphQL",
                    "Kafka"
                ],
                "location": "서울 노원구 동일로207길 17(중계동, 중계그린아파트)",
                "latitude": 37.64,
                "longitude": 127.06,
                "likeDto": {
                    "likeCount": 0,
                    "isLiked": null
                }
            }
        ],
        "pageable": {
            "sort": {
                "empty": false,
                "unsorted": false,
                "sorted": true
            },
            "offset": 0,
            "pageNumber": 0,
            "pageSize": 4,
            "unpaged": false,
            "paged": true
        },
        "last": false,
        "totalPages": 2,
        "totalElements": 5,
        "first": true,
        "size": 4,
        "number": 0,
        "sort": {
            "empty": false,
            "unsorted": false,
            "sorted": true
        },
        "numberOfElements": 4,
        "empty": false
    }
};
