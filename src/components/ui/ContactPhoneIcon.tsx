type ContactPhoneIconProps = {
  className?: string;
};

export function ContactPhoneIcon({ className }: ContactPhoneIconProps) {
  return (
    <svg
      viewBox="0 0 38 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M5.8 4.7 10 3.2c.9-.3 1.9.1 2.3 1l2.1 5c.4.9.1 1.9-.7 2.4l-2.5 1.6c1.8 4 4.7 6.9 8.7 8.7l1.6-2.5c.5-.8 1.5-1.1 2.4-.7l5 2.1c.9.4 1.3 1.4 1 2.3l-1.5 4.2c-.3.9-1.2 1.5-2.2 1.4C14.3 27.7 5.3 18.7 4.4 6.9c-.1-1 .5-1.9 1.4-2.2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.6 3.8h10.1c1.6 0 2.9 1.3 2.9 2.9v6.1c0 1.6-1.3 2.9-2.9 2.9h-3.3l-3.7 3v-3h-3.1c-1.6 0-2.9-1.3-2.9-2.9V6.7c0-1.6 1.3-2.9 2.9-2.9Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="22" cy="9.8" r="1" fill="currentColor" />
      <circle cx="25.7" cy="9.8" r="1" fill="currentColor" />
      <circle cx="29.4" cy="9.8" r="1" fill="currentColor" />
    </svg>
  );
}
