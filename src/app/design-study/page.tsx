import type { Metadata } from "next";
import StudioHome from "@/components/StudioHome";

export const metadata: Metadata = {
  title: "Developer studio — Design preview",
  description: "Design preview of Hoàng Anh Vũ’s portfolio.",
  robots: { index: false, follow: false },
};

export default function DesignStudy() {
  return <StudioHome preview />;
}
