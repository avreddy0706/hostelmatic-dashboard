export interface Room {
  id: string;
  floor: number;
  roomNumber: string;
  totalBeds: number;
  occupiedBeds: number;
}

export interface Tenant {
  id: string;
  name: string;
  phone: string;
  email: string;
  roomId: string;
  joinDate: string;
  monthlyFee: number; // Added monthly fee
}

export interface Payment {
  id: string;
  tenantId: string;
  amount: number;
  month: string;
  status: "paid" | "unpaid";
  dueDate: string;
  paidDate?: string;
}