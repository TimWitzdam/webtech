type Props = {
  progress: number;
};

export default function ProgressBar(props: Props) {
  return (
    <div className="bg-border-100 rounded-full h-2">
      <div
        className="bg-primary rounded-full h-2"
        style={{
          width: `${props.progress}%`,
        }}
      />
    </div>
  );
}
