import s from "./Spinner.module.css";

const Spinner = () => {
  return (
    <div className={s.spinnerWrapper}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50"
        height="50"
        viewBox="0 0 50 50"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="90"
          strokeDashoffset="0"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            dur="1s"
            from="0 25 25"
            to="360 25 25"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
};

export default Spinner;
