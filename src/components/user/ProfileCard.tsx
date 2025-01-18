import React from 'react'
import PhoneIcon from "../../assets/icons/PhoneIcon.png";
import MessageIcon from "../../assets/icons/MessageIcon.png";

interface ProfileCardProps {
  name: string;
  introduction: string;
  email: string;
  phoneNum: string;
  age: number;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  introduction,
  email,
  phoneNum,
  age
}) => {
  return (
    <div className="flex flex-col justify-center items-center bg-white rounded-2xl shadow-lg p-8 w-2/3">
      <div className='flex items-center justify-center'>
        <p className='font-scdream6 text-bold text-label mr-2'>
          {name}
        </p>
        <p className='font-scdream4 text-sub text-regular'>
          {age}세
        </p>
      </div>

      <p className='font-scdream4 text-bold text-regular my-2'>
        {introduction}
      </p>

      <div className='flex items-center justify-start my-1'>
        <img
          src={PhoneIcon}
          alt="phoneIcon"
          className='h-4 mr-2'
        />
        <p className='font-scdream4 text-bold text-regular'>
          {phoneNum}
        </p>
      </div>

      <div className='flex items-center justify-start my-1'>
        <img
          src={MessageIcon}
          alt="messageIcon"
          className='h-4 mr-2'
        />
        <p className='font-scdream4 text-bold text-regular'>
          {email}
        </p>
      </div>
    </div>
  );
}


export default ProfileCard
