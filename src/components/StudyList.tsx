import React, { useState } from 'react';
import styled from "styled-components";
import { PostListInfo } from "../types/api/post";
import InformCard from "./InformCard";

const ListContainer = styled.div`
  width: 27%;
  padding: 10px 20px;
  background-color: #f6f1fb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

interface StyledButtonProps {
  $active: boolean;
}

const PaginationNumberButton = styled.button<StyledButtonProps>`
  margin: 5px;
  font-size: 16px;
  font-family: "SCDream4";
  color: #7c8bbe;
  background-color: transparent;
  border: none;
  font-weight: ${({ $active }) => ($active ? "bold" : "normal")};
`;

const PaginationButton = styled.button`
  margin-left: 10px;
  margin-right: 10px;
  padding: 4px 15px;
  font-size: 16px;
  font-family: "SCDream4";
  align-items: center;
  border-radius: 10px;
  color: #f6f1fb;
  background-color: #7c8bbe;
  border: none;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
  margin-bottom: 15px;
`;

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
  const showPagination = studies && studies.length > studiesPerPage;

  return (
    <ListContainer>
      {studiesToDisplay.map((study) => (
        <InformCard
          key={study.postId}
          postId={study.postId}
          skill={study.skill}
          place={study.place}
          progress={study.progress}
          peopleNum={study.peopleNum}
          deadline={study.deadline}
          type={study.type}
          title={study.title}
        />
      ))}
      {showPagination && (
        <PaginationContainer>
          <PaginationButton
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            이전
          </PaginationButton>
          {Array.from({ length: totalPages }).map((_, index) => (
            <PaginationNumberButton
              key={index}
              $active={currentPage === index + 1}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </PaginationNumberButton>
          ))}
          <PaginationButton
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            다음
          </PaginationButton>
        </PaginationContainer>
      )}
    </ListContainer>
  );
});

export default StudyList;
