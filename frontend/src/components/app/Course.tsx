import { formatDate } from "../../lib/formatDate";
import ProgressBar from "./ProgressBar";

type Props = {
  name: string;
  link: string;
  image: string;
  emoji: string;
  lastChanged: Date;
  progress: { current: number; total: number };
};

export default function Course(props: Props) {
  return (
    <a
      href={props.link}
      className="rounded-xl border border-border-100 hover:border-border-200 transition-colors"
    >
      <div className="py-6 rounded-t-xl bg-bg-300 grid place-content-center relative">
        <img src={props.image} alt={props.name} className="object-cover" />
        <div className="absolute -bottom-7 left-0 p-4 bg-white rounded-r-xl">
          <p className="text-4xl">{props.emoji}</p>
        </div>
      </div>
      <div className="mt-6 px-3 pb-3">
        <p className="text-lg font-medium">{props.name}</p>
        <p className="text-gray mb-4 text-sm">
          Letze Änderung: {formatDate(props.lastChanged)}
        </p>
        <ProgressBar
          progress={(props.progress.current / props.progress.total) * 100}
        />
        <div className="mt-2 rounded-full border border-border-100 text-primary text-center text-sm py-1 px-3 w-fit">
          <span>
            {props.progress.current}/{props.progress.total}
          </span>
        </div>
      </div>
    </a>
  );
}
