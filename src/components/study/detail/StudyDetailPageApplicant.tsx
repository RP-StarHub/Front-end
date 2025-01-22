import React, { useState } from "react";
import StarIcon from "../../../assets/icons/StarIcon.png";
import CommentList from "./CommentList";
import { DetailPageProps } from "../../../types/models/study";
import { CommentCreateRequest } from "../../../types/api/comment";
import { useCommentCreate } from "../../../hooks/api/useComment";
import { useAuthStore } from "../../../store";
import Button from "../../common/ui/Button";
import TextArea from "../../common/ui/TextArea";

const StudyDetailPageApplicant: React.FC<DetailPageProps> = ({ studyDetail }) => {
  const [comment, setComment] = useState("");
  const user = useAuthStore((state) => state.user);

  const createComment = useCommentCreate();

  {/*
  const handleSubmit = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    const commentData: CommentCreateRequest = {
      postId: studyDetail[1],
      userId: Number(user.loginId),
      content: comment,
      pick: false,
    }

    try {
      await createComment.mutateAsync(commentData);
      window.location.reload();
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };
  */}

  const handleSubmit = () => {};

  return (
    <div className='flex flex-col w-full px-60 py-24 bg-white'>
      <div className="flex flex-col w-full h-full">
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
            <p className="font-scdream4 text-regular text-bold ml-4">
              {studyDetail[0].place}
            </p>
          </div>

          <div className="flex items-center">
            <p className="font-scdream6 text-main text-label">
              기술 스택
            </p>
            <p className="font-scdream4 text-regular text-bold ml-4">
              {studyDetail[0].skill}
            </p>
          </div>

          <div className="flex items-center">
            <p className="font-scdream6 text-main text-label">
              진행 기간
            </p>
            <p className="font-scdream4 text-regular text-bold ml-4">
              {studyDetail[0].progress}개월
            </p>
          </div>

          <div className="flex items-center">
            <p className="font-scdream6 text-main text-label">
              모집 인원
            </p>
            <p className="font-scdream4 text-regular text-bold ml-4">
              {studyDetail[0].peopleNum}명
            </p>
          </div>

          <div className="flex items-center">
            <p className="font-scdream6 text-main text-label">
              모집 마감일
            </p>
            <p className="font-scdream4 text-regular text-bold ml-4">
              {studyDetail[0].deadline}
            </p>
          </div>
        </div>

        <div className='w-full h-px bg-sub my-6' />

        <p className='font-scdream6 text-main text-label mb-4'>
          스터디 소개
        </p>
        <p className='font-scdream4 text-regular text-bold'>
          {studyDetail[0].content}
        </p>
      </div>

      <div className='w-full h-2 bg-sub my-10' />

      <p className='font-scdream6 text-main text-label mb-4'>댓글</p>
      <div className="flex flex-col w-full">
        <TextArea
          placeholder="댓글을 입력해주세요."
          onChange={(e) => setComment(e.target.value)}
          inputSize="medium"
          fullWidth
          className="border-sub"
        />
        <div className="flex justify-end">
          <Button
            variant='secondary'
            size='small'
            onClick={handleSubmit}
            className='mt-4'
          >
            등록
          </Button>
        </div>
        <CommentList
          comments={studyDetail[2]}
          isSelectable={false}
          postId={studyDetail[1]}
        />
      </div>
    </div>
  );
};

export default StudyDetailPageApplicant;