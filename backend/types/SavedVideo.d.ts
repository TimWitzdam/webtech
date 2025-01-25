import { ILastSeenVideo } from "./LastSeenVideo";

export interface ISavedVideo extends ILastSeenVideo {
  seen: boolean;
}
