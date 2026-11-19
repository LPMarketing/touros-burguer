interface BrandMarkProps {
  className?: string;
}

export function BrandMark({ className = 'w-11 h-11' }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="60" height="60" rx="16" fill="#141413" />
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="16"
        stroke="#FFD000"
        strokeOpacity="0.32"
        strokeWidth="1.5"
      />
      <path
        d="M15 16C13.8 24.4 18.6 30.2 24.4 31.2L22.5 43.8C22.5 48.2 26.8 51.5 32 51.5C37.2 51.5 41.5 48.2 41.5 43.8L39.6 31.2C45.4 30.2 50.2 24.4 49 16C46.1 21.6 41.4 23.4 36.8 23.4H27.2C22.6 23.4 17.9 21.6 15 16Z"
        fill="#FFD000"
      />
      <path
        d="M27.2 23.4H36.8L38.4 31.5H25.6L27.2 23.4Z"
        fill="#FFDE24"
        fillOpacity="0.4"
      />
      <circle cx="27" cy="34.2" r="2.1" fill="#080808" />
      <circle cx="37" cy="34.2" r="2.1" fill="#080808" />
      <path
        d="M27.5 43.6C27.5 46.2 29.5 48.2 32 48.2C34.5 48.2 36.5 46.2 36.5 43.6"
        stroke="#080808"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
