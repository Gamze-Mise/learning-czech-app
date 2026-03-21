"use client";

import { useRouter } from "next/navigation";

type Props = {
  className?: string;
  onDone?: () => void;
};

export default function SignOutButton({ className, onDone }: Props) {
  const router = useRouter();

  async function signOut() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      onDone?.();
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={signOut}
      className={
        className ??
        "hover:text-blue-200 transition-colors duration-200 font-medium"
      }
    >
      Sign out
    </button>
  );
}
