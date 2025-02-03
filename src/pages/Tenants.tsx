import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Phone, Mail, Home, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/lib/store";
import { Tenant } from "@/lib/types";

const Tenants = () => {
  const { toast } = useToast();
  const { rooms, tenants, addTenant, updateTenant, deleteTenant } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [newTenant, setNewTenant] = useState({
    name: "",
    phone: "",
    email: "",
    roomId: "",
    joinDate: "",
  });

  const availableRooms = rooms.filter(room => room.occupiedBeds < room.totalBeds);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tenantData = {
      id: editingTenant?.id || Date.now().toString(),
      ...newTenant,
    };

    if (editingTenant) {
      updateTenant(tenantData);
      toast({
        title: "Tenant Updated",
        description: `${tenantData.name} has been updated.`,
      });
    } else {
      addTenant(tenantData);
      toast({
        title: "Tenant Added",
        description: `${tenantData.name} has been added.`,
      });
    }

    setNewTenant({
      name: "",
      phone: "",
      email: "",
      roomId: "",
      joinDate: "",
    });
    setEditingTenant(null);
    setShowForm(false);
  };

  const handleEdit = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setNewTenant({
      name: tenant.name,
      phone: tenant.phone,
      email: tenant.email,
      roomId: tenant.roomId,
      joinDate: tenant.joinDate,
    });
    setShowForm(true);
  };

  const handleDelete = (tenant: Tenant) => {
    deleteTenant(tenant.id);
    toast({
      title: "Tenant Deleted",
      description: `${tenant.name} has been removed.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tenants</h1>
          <p className="text-gray-500">Manage your hostel tenants here</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Tenant
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newTenant.name}
                  onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={newTenant.phone}
                  onChange={(e) => setNewTenant({ ...newTenant, phone: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={newTenant.email}
                  onChange={(e) => setNewTenant({ ...newTenant, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomId">Room</Label>
                <Select
                  value={newTenant.roomId}
                  onValueChange={(value) => setNewTenant({ ...newTenant, roomId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a room" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        Room {room.roomNumber} ({room.occupiedBeds}/{room.totalBeds} beds)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="joinDate">Join Date</Label>
                <Input
                  id="joinDate"
                  type="date"
                  value={newTenant.joinDate}
                  onChange={(e) => setNewTenant({ ...newTenant, joinDate: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowForm(false);
                  setEditingTenant(null);
                  setNewTenant({
                    name: "",
                    phone: "",
                    email: "",
                    roomId: "",
                    joinDate: "",
                  });
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingTenant ? "Update Tenant" : "Add Tenant"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tenants.map((tenant) => {
          const room = rooms.find(r => r.id === tenant.roomId);
          return (
            <Card key={tenant.id} className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{tenant.name}</h3>
                    <p className="text-sm text-gray-500">
                      Room {room?.roomNumber || "Not assigned"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(tenant)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(tenant)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{tenant.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{tenant.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    <span>Joined: {new Date(tenant.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Tenants;