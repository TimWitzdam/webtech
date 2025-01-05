type Props = {
  icon: React.ReactNode;
  name: string;
  url: string;
};

export default function BottomNavbarRoute(props: Props) {
  const selected = window.location.pathname === props.url;
  return (
    <a
      href={props.url}
      className={`flex flex-col items-center py-3 transition-opacity ${selected ? "opacity-100" : "opacity-50"}`}
    >
      {props.icon}
      <span>{props.name}</span>
    </a>
  );
}
