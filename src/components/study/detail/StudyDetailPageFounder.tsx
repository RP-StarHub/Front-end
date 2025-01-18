import React from "react";
import StarIcon from "../../../assets/icons/StarIcon.png";
import CommentList from "./CommentList";
import { DetailPageProps } from "../../../types";

const StudyDetailPageFounder: React.FC<DetailPageProps> = ({ studyDetail }) => {
  return (
    <div className='flex flex-col w-full px-48 py-24 bg-background'>
      <div className='flex flex-col bg-white w-full h-full rounded-2xl shadow-lg p-8'>
        <div className='flex flex-row items-center mb-2'>
          <img
            src={StarIcon}
            alt={'Star Icon'}
            className='w-12 h-12'
          />
          <p className='font-gmarket-bold text-4xl text-bold ml-4'>
            [{studyDetail[0].type}] {studyDetail[0].title}
          </p>
        </div>
        <p className='text-label font-scdream6 text-sub mt-4 mb-6'>
          {studyDetail[0].userName} | {studyDetail[0].createdAt}
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <p className="font-scdream6 text-main text-label">
              진행 장소
            </p>
            <p className="font-scdream4 font-regular text-bold ml-4">
              {studyDetail[0].place}
            </p>
          </div>

          <div className="flex items-center">
            <p className="font-scdream6 text-main text-label">
              기술 스택
            </p>
            <p className="font-scdream4 font-regular text-bold ml-4">
              {studyDetail[0].skill}
            </p>
          </div>

          <div className="flex items-center">
            <p className="font-scdream6 text-main text-label">
              진행 기간
            </p>
            <p className="font-scdream4 font-regular text-bold ml-4">
              {studyDetail[0].progress}개월
            </p>
          </div>

          <div className="flex items-center">
            <p className="font-scdream6 text-main text-label">
              모집 인원
            </p>
            <p className="font-scdream4 font-regular text-bold ml-4">
              {studyDetail[0].peopleNum}명
            </p>
          </div>

          <div className="flex items-center">
            <p className="font-scdream6 text-main text-label">
              모집 마감일
            </p>
            <p className="font-scdream4 font-regular text-bold ml-4">
              {studyDetail[0].deadline}
            </p>
          </div>
        </div>

        <div className='w-full h-px bg-sub my-6' />

        <p className='font-scdream6 text-main text-label mb-4'>
          스터디 소개
        </p>
        <p className='font-scdream4 font-regular text-bold'>
          {studyDetail[0].content}
        </p>
      </div>

      <div className="flex flex-col mt-12">
        <p className='font-scdream6 text-main text-label mb-4'>댓글</p>
        <CommentList
          comments={studyDetail[2]}
          isSelectable
          postId={studyDetail[1]}
        />
      </div>
    </div>
  );
};

export default StudyDetailPageFounder;
