import { formatDate } from "../../lib/formatDate";

type Props = {
  link: string;
  image: string;
  title: string;
  course: { name: string; emoji: string };
  addedAt: Date;
};

export default function Video(props: Props) {
  return (
    <div>
      <img
        src={props.image}
        alt={props.title}
        className="rounded-xl object-cover mb-2 w-full max-h-[220px]"
      />
      <div className="flex gap-2">
        <div className="w-10 h-10 rounded-full grid place-content-center bg-bg-300">
          {props.course.emoji}
        </div>
        <div>
          <p className="text-lg font-medium">{props.title}</p>
          <p className="text-gray text-sm">{props.course.name}</p>
          <p className="text-sm">{formatDate(props.addedAt)}</p>
        </div>
      </div>
    </div>
  );
}
