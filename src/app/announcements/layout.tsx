import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Announcements | NotifyHub",
};

export default function AnnouncementsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
