import { IFormattedComment } from "./FormattedComment";

export interface IVideoComments extends IFormattedComment {
  answers: IFormattedComment[] | [];
}
