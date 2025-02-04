
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
  monthlyFee: number;
}

export interface Payment {
  id: string;
  tenantId: string;
  amount: number;
  month: string;
  status: "paid" | "unpaid" | "partially-paid";
  dueDate: string;
  paidDate?: string;
  remarks?: string;
}
