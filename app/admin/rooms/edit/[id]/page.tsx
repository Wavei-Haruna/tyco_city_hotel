// app/admin/rooms/edit/[id]/page.tsx
import EditRoom from "@/components/admin/EditRoom";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Room | Tyco City Hotel Admin",
  description: "Update room information and details",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditRoomPage({ params }: PageProps) {
  const { id } = await params;

  return <EditRoom roomId={id} />;
}
