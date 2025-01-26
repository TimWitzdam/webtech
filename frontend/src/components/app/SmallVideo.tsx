import CircularProgressBar from "./ProgressCircle";

type Props = {
  link: string;
  image: string;
  title: string;
  course: string;
  progress: number;
};

export default function SmallVideo(props: Props) {
  const formattedProgress = props.progress.toFixed(0);
  return (
    <a href={props.link} className="block rounded-xl relative h-[295px]">
      <img
        src={props.image}
        alt={props.title}
        className="absolute top-0 left-0 w-full h-full object-cover rounded-xl"
        height={192}
      />
      <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-b from-transparent to-black/70 bg-opacity-30 rounded-xl text-white flex flex-col break-words">
        <div className="mt-auto p-2">
          <p>{props.title}</p>
          <p className="text-xs">{props.course}</p>
        </div>
      </div>
      <div className="absolute top-0 right-0 bg-white rounded-full py-1 px-2 text-primary mt-1 mr-1 text-sm flex items-center gap-2">
        <CircularProgressBar
          percentage={props.progress}
          size={20}
          strokeWidth={3}
        />
        <span>{formattedProgress}%</span>
      </div>
    </a>
  );
}
