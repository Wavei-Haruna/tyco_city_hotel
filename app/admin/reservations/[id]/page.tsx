
import ReservationDetailsView from "@/components/admin/ReservationsDetailView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reservation Details | Tyco City Hotel Admin",
  description: "View and manage reservation details",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ReservationDetailsPage({ params }: PageProps) {
  const { id } = await params;

  return <ReservationDetailsView reservationId={id} />;
}
