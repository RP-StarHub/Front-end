import React from "react";
import StarIcon from "../assets/icons/StarIcon.png";
import { AddressSearch } from "../components/study/form/AddressSearch";
import { useRecruitForm } from "../hooks/study/useRecruitForm";
import Button from "../components/common/ui/Button";
import TextArea from "../components/common/ui/TextArea";
import TextInput from "../components/common/ui/TextInput";

const StudyRecruitPage = () => {
  const {
    formData,
    errors,
    setFormData,
    setAddressObj,
    setLatLng,
    handleInputChange,
    handleSubmit,
  } = useRecruitForm();

  return (
    <div className="flex flex-col w-full bg-background px-48 py-24">
      <div className="flex items-center">
        <img
          src={StarIcon}
          alt={"Star Icon"}
          className="w-8 h-8 mr-2"
        />
        <p className="font-gmarket-bold text-page-title text-bold">
          프로젝트 기본 정보
        </p>
      </div>

      <div className='h-px bg-sub my-4' />

      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col mb-2">
            <p className="font-scdream6 text-label text-bold mb-2">
              모집 구분
            </p>
            <TextInput
              type="text"
              name="type"
              placeholder="스터디와 프로젝트 중 선택해주세요."
              value={formData.type}
              fullWidth
              bordered
              error={errors.type}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col mb-2">
            <p className="font-scdream6 text-label text-bold mb-2">
              기술 스택
            </p>
            <TextInput
              type="text"
              name="skill"
              placeholder="사용되는 기술 스택을 입력해주세요. ex) 리액트, 스프링..."
              value={formData.skill}
              fullWidth
              bordered
              error={errors.skill}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col mb-2">
            <p className="font-scdream6 text-label text-bold mb-2">
              모집 인원
            </p>
            <TextInput
              type="text"
              name="peopleNum"
              placeholder="모집 인원 수를 입력해주세요. ex) 3~5"
              value={formData.peopleNum}
              fullWidth
              bordered
              error={errors.peopleNum}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col mb-2">
            <p className="font-scdream6 text-label text-bold mb-2">
              진행 기간
            </p>
            <TextInput
              type="text"
              name="progress"
              placeholder="진행 기간을 입력해주세요."
              value={formData.progress}
              fullWidth
              bordered
              error={errors.progress}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col mb-2">
            <p className="font-scdream6 text-label text-bold mb-2">
              진행 장소
            </p>
            <AddressSearch
              addressValue={formData.place}
              setAddressObj={setAddressObj}
              setLatLng={setLatLng}
              setFormData={setFormData}
              handleInputChange={handleInputChange}
              error={errors.place}
            />
          </div>
          <div className="flex flex-col mb-2">
            <p className="font-scdream6 text-label text-bold mb-2">
              모집 마감일
            </p>
            <TextInput
              type="date"
              name="deadline"
              placeholder="**** - ** - **"
              value={formData.deadline}
              fullWidth
              bordered
              error={errors.deadline}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center mt-8">
        <img
          src={StarIcon}
          alt={"Star Icon"}
          className="w-8 h-8 mr-2"
        />
        <p className="font-gmarket-bold text-page-title text-bold">
          프로젝트 소개
        </p>
      </div>

      <div className='h-px bg-sub my-4'/>

      <div className="flex flex-col py-4">
        <p className="font-scdream6 text-label text-bold mb-2">
          제목
        </p>
        <TextInput
          type="text"
          name="title"
          placeholder="제목을 입력해주세요."
          value={formData.title}
          fullWidth
          bordered
          error={errors.title}
          onChange={handleInputChange}
        />

        <div className="my-4"/>

        <p className="font-scdream6 text-label text-bold mb-2">
          내용
        </p>
        <TextArea
          name="content"
          placeholder="내용을 입력해주세요."
          fullWidth
          value={formData.content}
          onChange={handleInputChange}
          error={errors.content}
          className="rounded-xl"
          rows={10}
        />
      </div>

      <div className="flex justify-end">
        <Button
          variant="secondary"
          onClick={handleSubmit}
        >
          글 등록
        </Button>
      </div>
    </div>
  );
};

export default StudyRecruitPage;