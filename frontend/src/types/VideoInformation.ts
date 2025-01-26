interface VideoDetails {
  _id: string;
  title: string;
  creationDate: string;
}

interface CourseReference {
  _id: string;
  name: string;
}

export default interface VideoInformation {
  video: VideoDetails;
  course: CourseReference[];
}
