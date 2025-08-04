export function LV() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 512 512"
    >
      <mask id="circle">
        <circle cx="256" cy="256" r="256" fill="#fff" />
      </mask>
      <g mask="url(#circle)">
        <path
          fill="#a2001d"
          d="M0 0h512v189.2l-38.5 70 38.5 63.6V512H0V322.8l39.4-63L0 189.1z"
        />
        <path fill="#eee" d="M0 189.2h512v133.6H0z" />
      </g>
    </svg>
  );
}
export default LV;
