import BaseButton from "../BaseButton";

type Props = {
  icon: React.ReactNode;
  title: string;
  link?: string;
  children: React.ReactNode;
};

export default function DashboardSection(props: Props) {
  return (
    <div className="border border-border-100 rounded-xl h-full">
      <div className="flex items-center justify-between border-b border-border-100 rounded-t-xl bg-bg-100 px-4 text-lg h-[58px]">
        <div className="flex items-center gap-3">
          {props.icon}
          <span className="text-lg">{props.title}</span>
        </div>
        {props.link && (
          <a href={props.link} className="text-xs">
            <BaseButton type="rounded">Alle ansehen</BaseButton>
          </a>
        )}
      </div>
      <div>{props.children}</div>
    </div>
  );
}
