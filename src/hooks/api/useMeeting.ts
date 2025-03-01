import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query"
import { CreateMeetingRequest, GetMeetingListResponse, PatchMeetingRequest, PatchMemberRequest } from "../../types/api/meeting"
import { meetingService, mockMeetingService } from "../../services/api/meeting";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const useCreateMeeting = () => {
  const queryClient = useQueryClient();
  const createMeeting = useMutation({
    mutationFn: (data: CreateMeetingRequest) => 
      meetingService.createMeeting(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
    },
    onError: (error: any) => {
      if (error?.response?.status === 400) {
        toast.error('입력하신 정보를 다시 확인해주세요.');
      } else if (error?.response?.status === 401) {
        toast.error('로그인이 필요합니다.');
      } else {
        toast.error('모임 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    }
  });
  return createMeeting

  // 목업용
  // return useMutation({
  //   mutationFn: (data: CreateMeetingRequest) =>
  //     mockMeetingService.createMeeting(data),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['meetings'] });
  //   }
  // });
}

export const useMeetingList = (page: number) => {
  const queryOptions: UseQueryOptions<GetMeetingListResponse> = {
    queryKey: ['meetings', page],
    queryFn: async () => {
      const response = await meetingService.getMeetingList(page - 1);
      return response.data
    },
    // 데이터가 바로 만료되도록 설정 (새로고침 시 항상 새 데이터 fetch)
    staleTime: 0,
    // 새 데이터 로딩 중에 이전 데이터 표시
    placeholderData: (previousData) => previousData,
  };
  return useQuery<GetMeetingListResponse>(queryOptions);

  // return useQuery<GetMeetingListResponse>({
  //   queryKey: ['meetings'],
  //   queryFn: async () => {
  //     const response = await mockMeetingService.getMeetingList(0);
  //     return response.data
  //   }
  // });
};

export const useMeetingDetail = (id: number) => {
  return useQuery({
    queryKey: ['meeting', id],
    queryFn: async () => {
      const response = await meetingService.getMeetingDetail(id);
      return response.data;
    },
    staleTime: 0,
    placeholderData: (previousData) => previousData,
  });

  // 목업용
  // return useQuery({
  //   queryKey: ['meeting', id],
  //   queryFn: async () => {
  //     const response = await mockMeetingService.getMeetingDetail(id);
  //     return response.data
  //   }
  // })
};

export const useMeetingPatch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number, data: PatchMeetingRequest }) => 
      meetingService.patchMeeting(id, data),
    onSuccess: (_, variables) => {
      // 수정 성공시 상세 데이터와 목록 데이터를 모두 갱신
      queryClient.invalidateQueries({ queryKey: ['meeting', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
    },
    onError: (error: any) => {
      if (error?.response?.status === 400) {
        if (error?.response?.data?.code === 'STUDY_CONFIRMED') {
          toast.error('스터디원이 확정된 상태에서는 글을 수정할 수 없습니다.');
          return;
        }
        toast.error('입력하신 정보를 다시 확인해주세요.');
      } else if (error?.response?.status === 404) {
        toast.error('존재하지 않는 모임입니다.');
      } else {
        toast.error('수정에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    }
  });

  // 목업
  // return useMutation({
  //   mutationFn: ({ id, data }: { id: number, data: PatchMeetingRequest }) =>
  //     mockMeetingService.patchMeeting(id, data),
  // });
};

export const useMeetingDelete = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (id: number) => meetingService.deleteMeeting(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      toast.success('모임이 삭제되었습니다.');
      navigate('/');
    },
    onError: (error: any) => {
      if (error?.response?.status === 400) {
        if (error?.response?.data?.code === 'STUDY_CONFIRMED') {
          toast.error('스터디원이 확정된 상태에서는 글을 삭제할 수 없습니다.');
          return;
        }
        toast.error('입력하신 정보를 다시 확인해주세요.');
      } else if (error?.response?.status === 404) {
        toast.error('이미 삭제되거나 잘못된 게시글입니다. 화면을 새로고침해주세요.');
      } else {
        toast.error('삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    }
  });

  // 목업
  // return useMutation({
  //   mutationFn: (id: number) => mockMeetingService.deleteMeeting(id),
  // });
};

export const useConfirmMeetingMembers = (meetingId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PatchMemberRequest) => 
      meetingService.patchMeetingMember(meetingId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['meetingMembers', meetingId]
      });
      
      queryClient.invalidateQueries({
        queryKey: ['meetingDetail', meetingId]
      });
    }
  });
};

export const useGetMeetingMembers = (meetingId: number) => {
  return useQuery({
    queryKey: ['meetingMembers', meetingId],
    queryFn: () => meetingService.getMeetingMember(meetingId),
    select: (response) => response.data.data,
    enabled: !!meetingId
  });
};
