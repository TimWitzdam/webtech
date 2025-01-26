interface Progress {
  current: number;
  total: number;
}

interface CourseVideo {
  _id: string;
  title: string;
  creationDate: string;
  length: number;
  seen: boolean;
}

export default interface CourseInformation {
  _id: string;
  name: string;
  emoji: string;
  lastChanged: string;
  description: string;
  progress: Progress;
  videos: CourseVideo[];
  teachers: string[];
  languages: string[];
}
