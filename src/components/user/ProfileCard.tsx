import React from 'react'
import PhoneIcon from "../../assets/icons/PhoneIcon.png";
import MessageIcon from "../../assets/icons/MessageIcon.png";

interface ProfileCardProps {
  name: string;
  bio: string;
  email: string;
  phoneNumber: string;
  age: number;
}

const formatPhoneNumber = (phoneNumber: string): string => {
  const numbers = phoneNumber.replace(/[^0-9]/g, '');
  if (numbers.length !== 11) {
    return phoneNumber;
  }
  return numbers.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
};

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  bio,
  email,
  phoneNumber,
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
        {bio}
      </p>

      <div className='flex flex-col'>
        <div className='flex items-center justify-start my-1'>
          <img
            src={PhoneIcon}
            alt="phoneIcon"
            className='h-4 mr-2'
          />
          <p className='font-scdream4 text-bold text-regular'>
            {formatPhoneNumber(phoneNumber)}
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
    </div>
  );
};

export default ProfileCard