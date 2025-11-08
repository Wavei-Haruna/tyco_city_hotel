// app/admin/rooms/page.tsx
import RoomsList from "@/components/admin/RoomList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rooms Management | Tyco City Hotel Admin",
  description: "Manage hotel rooms and availability",
};

export default function RoomsPage() {
  return <RoomsList />;
}