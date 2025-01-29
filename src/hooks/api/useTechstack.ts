import { useQuery } from "@tanstack/react-query";
import { techStackService, mockTechStackService } from "../../services/api/techstack";

export const useGetTechStack = () => {
  return useQuery({
    queryKey: ['techStacks'],
    queryFn: async () => {
      const response = await techStackService.getTechStack();
      return response.data;
    }
  });

  // 목업용
  // return useQuery({
  //   queryKey: ['techStacks'],
  //   queryFn: async () => {
  //     const response = await mockTechStackService.getTechStack();
  //     return response.data;
  //   }
  // });
};