import React from 'react';
import styled from "styled-components";
import ProfileCard from '../components/ProfileCard';
import PickIcon from "../assets/icons/PickIcon.png";
import { useParams } from 'react-router-dom';
import { useUserPicked } from '../hooks/api/useComment';

const PageContainer = styled.div`
  height: 500px;
  background-color: #f6f1fb;
  padding-bottom: 100px;
`;

const PickContainer = styled.div`
  flex-direction: row;
  display: flex;
  align-items: center;
  padding-top: 50px;
  margin-left: 60px;
`;

const PickText = styled.div`
  font-size: 50px;
  font-family: "GmarketSans";
  color: #7c8bbe;
  margin-left: 10px;
`;

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr); 
  gap: 70px;
  padding: 40px;
  justify-items: center;
`;

const PickTitle: React.FC = () => {
  return (
    <PickContainer>
      <img 
        src={PickIcon} 
        style={{ width: "45px", height: "45px" }} 
        alt="Pick Icon" 
      />
      <PickText>Pick!</PickText>
    </PickContainer>
  );
};

const ApplicantListPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const { data: response, isLoading } = useUserPicked(Number(postId));
  
  const pickedUsers = response?.data.data || [];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <PageContainer>
      <PickTitle />
      <ListContainer>
        {pickedUsers.map((pickedUser) => (
          <ProfileCard
            key={pickedUser.user.email}
            name={pickedUser.user.name}
            introduction={pickedUser.user.introduction}
            email={pickedUser.user.email}
            phoneNum={pickedUser.user.phoneNum}
            age={pickedUser.user.age}
          />
        ))} 
      </ListContainer>
    </PageContainer>
  );
};

export default ApplicantListPage;