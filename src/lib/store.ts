import { create } from 'zustand';
import { Room, Tenant, Payment } from './types';

interface Store {
  rooms: Room[];
  tenants: Tenant[];
  payments: Payment[];
  addRoom: (room: Room) => void;
  updateRoom: (room: Room) => void;
  deleteRoom: (id: string) => void;
  addTenant: (tenant: Tenant) => void;
  updateTenant: (tenant: Tenant) => void;
  deleteTenant: (id: string) => void;
  addPayment: (payment: Payment) => void;
  updatePayment: (payment: Payment) => void;
  deletePayment: (id: string) => void;
}

export const useStore = create<Store>((set) => ({
  rooms: [],
  tenants: [],
  payments: [],
  addRoom: (room) =>
    set((state) => {
      console.log('Adding room:', room);
      return { rooms: [...state.rooms, room] };
    }),
  updateRoom: (room) =>
    set((state) => ({
      rooms: state.rooms.map((r) => (r.id === room.id ? room : r)),
    })),
  deleteRoom: (id) =>
    set((state) => ({
      rooms: state.rooms.filter((r) => r.id !== id),
    })),
  addTenant: (tenant) =>
    set((state) => {
      console.log('Adding tenant:', tenant);
      // Update room occupancy when adding tenant
      const updatedRooms = state.rooms.map((room) =>
        room.id === tenant.roomId
          ? { ...room, occupiedBeds: room.occupiedBeds + 1 }
          : room
      );
      return {
        tenants: [...state.tenants, tenant],
        rooms: updatedRooms,
      };
    }),
  updateTenant: (tenant) =>
    set((state) => ({
      tenants: state.tenants.map((t) => (t.id === tenant.id ? tenant : t)),
    })),
  deleteTenant: (id) =>
    set((state) => ({
      tenants: state.tenants.filter((t) => t.id !== id),
    })),
  addPayment: (payment) =>
    set((state) => ({
      payments: [...state.payments, payment],
    })),
  updatePayment: (payment) =>
    set((state) => ({
      payments: state.payments.map((p) => (p.id === payment.id ? payment : p)),
    })),
  deletePayment: (id) =>
    set((state) => ({
      payments: state.payments.filter((p) => p.id !== id),
    })),
}));