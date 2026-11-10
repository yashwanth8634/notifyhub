import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | NotifyHub",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
