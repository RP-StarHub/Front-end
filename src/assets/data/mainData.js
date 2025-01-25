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
                "latitude": 37.6379556162713,
                "longitude": 127.059802173858,
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
                "latitude": 37.6428261184872,
                "longitude": 127.061284491782,
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
                "latitude": 37.639134802371,
                "longitude": 127.060377664153,
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
                "latitude": 37.6427368269293,
                "longitude": 127.064172805678,
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

export const mockDetailData = {
    "status": 200,
    "code": "SUCCESS_GET_MEETING_DETAIL",
    "message": "모임 상세 정보를 성공적으로 불러왔습니다.",
    "data": {
        "isApplicant": false,
        "applicationStatus": false,
        "postInfo": {
            "id": 2,
            "recruitmentType": "STUDY",
            "maxParticipants": 3,
            "duration": "ONE_WEEK",
            "endDate": "2025-01-31",
            "location": "서울 노원구 동일로207길 186(하계동, 학여울청구아파트)",
            "latitude": 37.6379556162713,
            "longitude": 127.059802173858,
            "title": "ㅎㅇ",
            "description": "ㅇㅇㅇㅇㅇ",
            "goal": "ㅇㅇㅇㅇ",
            "otherInfo": "ㅇㅇㅇㅇㅇㅇ",
            "isConfirmed": false,
            "creator": {
                "username": "dara12"
            },
            "techStacks": [
                "React",
                "Vue",
                "HTML/CSS",
                "Spring",
                "Docker"
            ]
        },
        "likeDto": {
            "likeCount": 1,
            "isLiked": true
        }
    }
}