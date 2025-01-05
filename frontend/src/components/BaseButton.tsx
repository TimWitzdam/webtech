type Props = {
  type?: "primary" | "secondary" | "rounded";
  buttonType?: "button" | "submit" | "reset";
  children: React.ReactNode;
  id?: string;
  fullWidth?: boolean;
  className?: string;
  onClick?: () => void;
};

export default function BaseButton({
  type = "primary",
  buttonType = "button",
  children,
  id,
  fullWidth,
  className,
  onClick,
}: Props) {
  const buttonStyles = {
    primary: "bg-primary border-transparent text-white hover:bg-secondary",
    secondary: "border-border-100 hover:border-border-200",
    rounded: "!rounded-full !p-3 border-border-100 hover:border-border-200",
  };

  return (
    <button
      id={id}
      onClick={onClick}
      type={buttonType}
      className={`font-medium px-5 py-3 rounded-lg border transition-colors ${buttonStyles[type]} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {children}
    </button>
  );
}
