// app/admin/rooms/create/page.tsx
import CreateRoomListing from "@/components/admin/CreateRoomListing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Room Listing | Tyco City Hotel Admin",
  description: "Add a new room to the hotel inventory",
};

export default function CreateRoomPage() {
  return <CreateRoomListing />;
}