"use client";

import { useId, useState } from "react";

function EyeIcon(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className ?? "h-5 w-5"}
      aria-hidden
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
    </svg>
  );
}

function EyeOffIcon(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className ?? "h-5 w-5"}
      aria-hidden
    >
      <path d="M10.6 10.6a2.5 2.5 0 0 0 2.8 2.8" />
      <path d="M9.1 5.1A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a19.8 19.8 0 0 1-3.7 4.9" />
      <path d="M6.2 6.2C3.5 8.3 2 12 2 12s3.5 7 10 7c1.2 0 2.4-.2 3.4-.6" />
      <path d="M2 2l20 20" />
    </svg>
  );
}

type BaseInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
>;

export default function PasswordInput(props: BaseInputProps) {
  const autoId = useId();
  const [visible, setVisible] = useState(false);

  const { className, id, ...rest } = props;

  return (
    <div className="relative">
      <input
        {...rest}
        id={id ?? autoId}
        type={visible ? "text" : "password"}
        className={`${className ?? ""} pr-11`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
      </button>
    </div>
  );
}

