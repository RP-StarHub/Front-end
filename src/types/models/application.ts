export interface Application {
  id: number;
  content: string;
  updatedAt: string;
  applicant : {
    nickname: string;
  }
}