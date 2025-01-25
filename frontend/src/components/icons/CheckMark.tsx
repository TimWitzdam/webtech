type Props = {
  size?: number;
};

export default function CheckMark({ size = 29 }: Props) {
  return (
    <svg
      width={size}
      height={size + 4}
      viewBox="0 0 29 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_88_3403)">
        <path
          d="M27.8203 6.79336C28.6132 7.59902 28.6132 8.90742 27.8203 9.71309L11.5822 26.2131C10.7893 27.0188 9.5017 27.0188 8.70882 26.2131L0.589774 17.9631C-0.203102 17.1574 -0.203102 15.849 0.589774 15.0434C1.38265 14.2377 2.67028 14.2377 3.46316 15.0434L10.1487 21.8303L24.9533 6.79336C25.7461 5.9877 27.0338 5.9877 27.8266 6.79336H27.8203Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_88_3403">
          <rect width="28.4167" height="33" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
