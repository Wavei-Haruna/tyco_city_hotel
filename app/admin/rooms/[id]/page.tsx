// app/admin/rooms/[id]/page.tsx
import ViewRoomDetails from "@/components/admin/ViewRoomDetails";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Room Details | Tyco City Hotel Admin",
  description: "View room details and manage room information",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RoomDetailsPage({ params }: PageProps) {
  // Await the params in Next.js 15
  const { id } = await params;

  return <ViewRoomDetails roomId={id} />;
}