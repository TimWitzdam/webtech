export default interface VideoData {
  video: {
    _id: string;
    title: string;
    creationDate: string;
    length: number;
  };
  foundIn: {
    _id: string;
    name: string;
    emoji: string;
  }[];
  progress: number;
  seen: boolean;
}
