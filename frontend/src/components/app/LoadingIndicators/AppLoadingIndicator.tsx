type Props = {
  number?: number;
};

export default function AppLoadingIndicator({ number = 3 }: Props) {
  return (
    <div className="relative h-[320px]">
      <div className="absolute p-3 top-0 left-0 w-full h-full">
        <div
          className={`animate-[pulse_1s_cubic-bezier(0.4,0,0.6,1)_infinite] grid grid-cols-${number} gap-4 h-full`}
        >
          {Array.from(Array(number).keys()).map((index) => (
            <div
              key={index}
              className="border border-border-100 bg-border-100 rounded-xl p-3 flex flex-col justify-end gap-3 w-full"
            >
              <div className="rounded-full bg-white bg-opacity-60 h-3 w-24"></div>
              <div className="rounded-full bg-white bg-opacity-60 h-3 w-12"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
