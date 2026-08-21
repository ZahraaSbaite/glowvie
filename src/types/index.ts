export type ServiceDTO = {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  benefits: string[];
  procedure: string;
  recoveryTime: string;
  durationMins: number;
  price: number | null;
  imageUrl: string;
  featured: boolean;
  displayOrder: number;
  isActive: boolean;
};

export type BookingDraft = {
  serviceId: string | null;
  serviceTitle: string | null;
  specialistId: string | null;
  specialistName: string | null;
  date: string | null;
  time: string | null;
  fullName: string;
  phone: string;
  email: string;
  notes: string;
};

export type AppointmentDTO = {
  id: string;
  serviceId: string;
  serviceTitle: string;
  specialistName: string | null;
  fullName: string;
  phone: string;
  email: string;
  notes: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
};
