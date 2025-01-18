type Props = {
  icon: React.ReactNode;
  name: string;
  value?: string;
  children?: React.ReactNode;
};

export default function CourseProperty(props: Props) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex items-center gap-2 text-gray shrink-0 basis-2/5">
        {props.icon}
        <span>{props.name}</span>
      </div>
      {props.value && <p>{props.value}</p>}
      {props.children && <div className="w-full">{props.children}</div>}
    </div>
  );
}
