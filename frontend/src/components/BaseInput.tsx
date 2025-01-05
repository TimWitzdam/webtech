type Props = {
  type: string;
  value?: string | number;
  placeholder?: string;
  name?: string;
  label?: string;
  width?: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function BaseInput(props: Props) {
  return (
    <div>
      {props.label && (
        <label htmlFor={props.name} className="text-gray">
          {props.label}
        </label>
      )}
      <div
        className={`rounded-lg border border-border-100 hover:border-border-200 transition-colors focus-within:border-border-200 ${props.label && "mt-2"}`}
      >
        <input
          type={props.type}
          value={props.value}
          placeholder={props.placeholder}
          name={props.name}
          onChange={props.onChange}
          required={props.required}
          className={`w-full bg-transparent outline-none p-3 placeholder:text-gray ${props.width && props.width}`}
        />
      </div>
    </div>
  );
}
