import UserIcon from "../icons/UserIcon";
import TrippleDot from "../icons/TrippleDot";
import BaseButton from "../BaseButton";
import LikeIcon from "../icons/LikeIcon";
import AnswerIcon from "../icons/AnswerIcon";
import { formatDate } from "../../lib/formatDate";
import { useState } from "react";

type Props = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
  onLike: (id: string) => void;
  onAnswer: (id: string) => void;
  onReport: (id: string) => void;
};

export default function Comment(props: Props) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div>
      <div className="flex items-start justify-between">
        <div className="flex gap-2">
          <div className="w-11 h-11 rounded-full border border-border-100 grid place-content-center text-primary">
            <UserIcon />
          </div>
          <div>
            <p className="font-medium">{props.author}</p>
            <p className="text-gray text-sm">{formatDate(props.createdAt)}</p>
          </div>
        </div>
        <button
          className="w-8 h-8 rounded-full border border-border-100 grid place-content-center relative hover:border-border-200 transition-colors"
          onClick={() => setShowPopup(!showPopup)}
        >
          <TrippleDot />
          {showPopup && (
            <div className="absolute top-full mt-1 right-0 bg-white rounded-xl border border-border-100 z-30">
              <div
                className="p-3 text-red whitespace-nowrap"
                onClick={() => props.onReport(props.id)}
              >
                Kommentar melden
              </div>
            </div>
          )}
        </button>
      </div>
      <p className="mt-3">{props.content}</p>
      <div className="flex gap-4 mt-3">
        <BaseButton type="rounded" onClick={() => props.onLike(props.id)}>
          <div className="flex items-center gap-2 px-1">
            <LikeIcon />
            <span>{props.likes}</span>
          </div>
        </BaseButton>
        <BaseButton type="rounded" onClick={() => props.onAnswer(props.id)}>
          <div className="flex items-center gap-2 px-1">
            <AnswerIcon />
            <span>Antworten</span>
          </div>
        </BaseButton>
      </div>
    </div>
  );
}
