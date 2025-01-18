import BaseButton from "../BaseButton";

type Props = {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
};

export default function VideoActionButton(props: Props) {
  return (
    <BaseButton
      type="secondary"
      className="flex items-center justify-between flex-col gap-3 text-center text-primary border border-border-100 py-4 w-full rounded-xl"
      onClick={props.onClick}
    >
      {props.icon}
      <span className="text-gray text-sm">{props.text}</span>
    </BaseButton>
  );
}
