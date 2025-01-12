export interface IVideoComment {
  user: {
    username: string;
    role: string;
  };
  comment: {
    text: string;
    timestamp: number;
  };
}
