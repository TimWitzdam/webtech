type Props = {
  name: string;
  url: string;
};

export default function HeaderLink(props: Props) {
  const selected = window.location.pathname === props.url;
  return (
    <a
      href={props.url}
      className={`font-medium text-lg opacity-60 hover:opacity-100 transition-opacity ${selected ? "!opacity-100" : ""}`}
    >
      {props.name}
    </a>
  );
}
