import React from 'react';
import { Meeting } from '../../types/models/meeting';
import { useNavigate } from 'react-router-dom';
import { Star } from '@mui/icons-material';
import InformCard from '../main/InformCard';

interface PopularMeetingSectionProps {
  title: string;
  meetings: Meeting[];
  viewAllLink?: string;
}

const PopularMeetingSection = ({ title, meetings, viewAllLink }: PopularMeetingSectionProps) => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="text-yellow" sx={{ fontSize: 30 }} />
          <h3 className="text-page-title font-gmarket-bold text-bold">{title}</h3>
        </div>
      </div>

      <div className="w-full h-px bg-bold mt-4 mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {meetings.map((meeting) => (
          <InformCard
            key={meeting.id}
            meeting={meeting}
            fullWidth
          />
        ))}
      </div>

      {viewAllLink && (
        <div className='flex justify-end mt-4'>
          <button
            onClick={() => navigate(viewAllLink)}
            className="text-regular text-bold font-scdream4 hover:text-primary"
          >
            더보기 &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default PopularMeetingSection;