import React from 'react';
import { 
  usePopularProjects, 
  usePopularStudies, 
  usePopularExpiring
} from '../hooks/api/usePopular';
import PopularMeetingSection from '../components/popular/PopularMeetingSection';

function PopularPage() {
  const { data: projectsData, isLoading: projectsLoading, error: projectsError } = usePopularProjects();
  const { data: studiesData, isLoading: studiesLoading, error: studiesError } = usePopularStudies();
  const { data: expiringData, isLoading: expiringLoading, error: expiringError } = usePopularExpiring();

  const isLoading = projectsLoading || studiesLoading || expiringLoading;
  const hasError = projectsError || studiesError || expiringError;

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='text-xl'>Loading...</div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='text-xl text-red-500'>
          인기글을 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col w-full px-60 py-24 bg-background'>
      <h2 className="text-2xl font-gmarket-bold text-bold mb-10">인기글</h2>
      
      <div className='flex flex-col gap-16'>
        {projectsData && projectsData.length > 0 ? (
          <PopularMeetingSection
            title="프로젝트 인기글"
            meetings={projectsData}
          />
        ) : (
          <div className="text-center text-gray-500">프로젝트 인기글이 없습니다.</div>
        )}

        {studiesData && studiesData.length > 0 ? (
          <PopularMeetingSection
            title="스터디 인기글"
            meetings={studiesData}
          />
        ) : (
          <div className="text-center text-gray-500">스터디 인기글이 없습니다.</div>
        )}

        {expiringData && expiringData.length > 0 ? (
          <PopularMeetingSection
            title="마감임박 인기글"
            meetings={expiringData}
          />
        ) : (
          <div className="text-center text-gray-500">마감임박 인기글이 없습니다.</div>
        )}
      </div>
    </div>
  );
}

export default PopularPage;