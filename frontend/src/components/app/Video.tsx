import { formatDate } from "../../lib/formatDate";

type Props = {
  link: string;
  image: string;
  title: string;
  course: { name: string; emoji: string };
  addedAt: Date;
  duration: string;
};

export default function Video(props: Props) {
  return (
    <a href={props.link} className="group">
      <div className="relative group">
        <img
          src={props.image}
          alt={props.title}
          className="rounded-xl object-cover mb-2 w-full max-h-[220px]"
          height={220}
        />
        <div className="absolute bottom-0 right-0 mr-2 mb-2 text-white text-sm bg-[#5C5C5C] bg-opacity-40 backdrop-blur-sm rounded-full px-3 py-2">
          {props.duration}
        </div>
      </div>
      <div className="flex gap-2">
        <div className="w-10 h-10 rounded-full grid place-content-center bg-bg-300">
          {props.course.emoji}
        </div>
        <div>
          <p className="text-lg font-medium group-hover:underline">
            {props.title}
          </p>
          <p className="text-gray text-sm">{props.course.name}</p>
          <p className="text-sm">{formatDate(props.addedAt)}</p>
        </div>
      </div>
    </a>
  );
}
