import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import ProfileCard from '../components/ProfileCard';
import PickIcon from "../assets/icons/PickIcon.png";
// import { applicantData } from "../assets/data/applicantdata";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';

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

const PickTitle = () => {
  return (
    <PickContainer>
      <img src={PickIcon} style={{width: "45px", height: "45px"}} />
      <PickText>Pick!</PickText>
    </PickContainer>
  );
};

const ApplicantListPage = () => {

  const [applicantData, setApplicantData] = useState([]);

  const { postId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await axios.get(`http://localhost:8080/api/comment/pick/list?post_id=1`);
        const response = await axios.get(`http://localhost:8080/api/comment/pick/list?postId=${postId}`);
        setApplicantData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <PageContainer>
      <PickTitle />
      <ListContainer>
      {applicantData.map((applicant, index) => (
        <ProfileCard
          key={index}
          name={applicant.user.name}
          introduction={applicant.user.introduction}
          email={applicant.user.email}
          phone_num={applicant.user.phoneNum}
          age={applicant.user.age}
          // image={applicant.image}
        />
      ))} 
      </ListContainer>
    </PageContainer>
  );
};

export default ApplicantListPage;
