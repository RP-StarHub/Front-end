import { useQuery } from "@tanstack/react-query";
import { popularService, mockPopularService } from "../../services/api/popular";

/**
 * 프로젝트 인기글 목록을 조회하는 훅
 */
export const usePopularProjects = () => {
  return useQuery({
    queryKey: ['popularProjects'],
    queryFn: () => popularService.getPopularProjects(),
    select: (response) => response.data.data,
    staleTime: 5 * 60 * 1000,
  });
  
  // 목업 
  // return useQuery({
  //   queryKey: ['popularProjects'],
  //   queryFn: () => mockPopularService.getPopularProjects(),
  //   select: (response) => response.data.data,
  // });
};

/**
 * 스터디 인기글 목록을 조회하는 훅
 */
export const usePopularStudies = () => {
  return useQuery({
    queryKey: ['popularStudies'],
    queryFn: () => popularService.getPopularStudies(),
    select: (response) => response.data.data,
    staleTime: 5 * 60 * 1000,
  });
  
  // 목업 
  // eslint-disable-next-line no-unreachable
  // return useQuery({
  //   queryKey: ['popularStudies'],
  //   queryFn: () => mockPopularService.getPopularStudies(),
  //   select: (response) => response.data.data,
  // });
};

/**
 * 마감임박 인기글 목록을 조회하는 훅
 */
export const usePopularExpiring = () => {
  return useQuery({
    queryKey: ['popularExpiring'],
    queryFn: () => popularService.getPopularExpiring(),
    select: (response) => response.data.data,
    staleTime: 5 * 60 * 1000,
  });
  
  // 목업 
  // return useQuery({
  //   queryKey: ['popularExpiring'],
  //   queryFn: () => mockPopularService.getPopularExpiring(),
  //   select: (response) => response.data.data,
  // });
};