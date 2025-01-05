type Props = {
  type?: "primary" | "secondary";
  buttonType?: "button" | "submit" | "reset";
  children: React.ReactNode;
  id?: string;
  fullWidth?: boolean;
  onClick?: () => void;
};

export default function BaseButton({
  type = "primary",
  buttonType = "button",
  children,
  id,
  fullWidth,
  onClick,
}: Props) {
  const buttonStyles = {
    primary: "bg-primary border-transparent text-white hover:bg-secondary",
    secondary: "border-border-100 hover:border-border-200",
  };

  return (
    <button
      id={id}
      onClick={onClick}
      type={buttonType}
      className={`font-medium px-5 py-3 rounded-lg border transition-colors ${buttonStyles[type]} ${fullWidth ? "w-full" : ""}`}
    >
      {children}
    </button>
  );
}
