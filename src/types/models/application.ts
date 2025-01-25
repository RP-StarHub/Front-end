export interface Application {
  id: number;
  content: string;
  updatedAt: string;
  applicant : {
    username: string;
  }
}