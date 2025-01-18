import React, { useState } from 'react';
import { PostListInfo } from "../../types/api/post";
import InformCard from "./InformCard";

interface StudyListProps {
  studies: PostListInfo[];
  studiesPerPage?: number;
}

const StudyList = React.memo<StudyListProps>(({ studies, studiesPerPage = 4 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * studiesPerPage;
  const endIndex = startIndex + studiesPerPage;
  const studiesToDisplay = studies ? studies.slice(startIndex, endIndex) : [];
  const totalPages = studies ? Math.ceil(studies.length / studiesPerPage) : 0;

  return (
    <div className='flex flex-col bg-background w-1/3 px-4 py-6 h-full'>
      <div className="grid grid-rows-4 gap-4 flex-1 w-full items-center">
        {studiesToDisplay.map((study) => (
          <div key={study.postId} className="w-full min-h-0 justify-center flex">
            <InformCard
              postId={study.postId}
              skill={study.skill}
              place={study.place}
              progress={study.progress}
              peopleNum={study.peopleNum}
              deadline={study.deadline}
              type={study.type}
              title={study.title}
            />
          </div>
        ))}
      </div>

      <div className='flex justify-center items-center pt-4'>
        <button
          className='mx-2 py-1 px-4 font-button font-scdream4 bg-sub text-background rounded-lg border-none disabled:opacity-50'
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          이전
        </button>
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            className={`mx-1 px-2 font-button font-sub font-scdream4 bg-transparent border-none ${currentPage === index + 1 ? 'font-scdream6' : 'font-scdream4'
              }`}
            key={index}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className='mx-2 py-1 px-4 font-button font-scdream4 bg-sub text-white rounded-lg border-none disabled:opacity-50'
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          다음
        </button>
      </div>
    </div>
  );
});

export default StudyList;