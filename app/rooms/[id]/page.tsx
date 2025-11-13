// app/rooms/[id]/page.tsx
import Navbar from "@/components/navbar";
import RoomDetailPage from "@/components/RoomDetailPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Room Details | Tyco City Hotel",
  description: "View room details and make a reservation",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RoomPage({ params }: PageProps) {
  // Await the params in Next.js 15
  const { id } = await params;

  return <main>
              <Navbar />
          <RoomDetailPage params={{ id }} />
  </main> ;
}