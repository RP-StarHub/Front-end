import { DURATION, RecruitmentType } from "../types/models/meeting";

export const toKoreanRecruitmentType = (type: RecruitmentType): string => {
  const map = {
    [RecruitmentType.STUDY]: '스터디',
    [RecruitmentType.PROJECT]: '프로젝트'
  };
  return map[type];
};

export const toKoreanDuration = (duration: DURATION): string => {
  const map = {
    [DURATION.ONE_WEEK]: '1주',
    [DURATION.TWO_WEEKS]: '2주',
    [DURATION.ONE_MONTH]: '1개월',
    [DURATION.TWO_MONTHS]: '2개월',
    [DURATION.THREE_MONTHS]: '3개월',
    [DURATION.SIX_MONTHS]: '6개월',
    [DURATION.ONE_YEAR]: '1년',
    [DURATION.MORE_THAN_ONE_YEAR]: '1년 이상'
  };
  return map[duration];
};