import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Phone, Mail, Home } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Tenant {
  id: string;
  name: string;
  phone: string;
  email: string;
  roomNumber: string;
  joinDate: string;
}

const Tenants = () => {
  const { toast } = useToast();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newTenant, setNewTenant] = useState({
    name: "",
    phone: "",
    email: "",
    roomNumber: "",
    joinDate: "",
  });

  const handleAddTenant = (e: React.FormEvent) => {
    e.preventDefault();
    const tenant: Tenant = {
      id: Date.now().toString(),
      ...newTenant,
    };
    setTenants([...tenants, tenant]);
    setNewTenant({
      name: "",
      phone: "",
      email: "",
      roomNumber: "",
      joinDate: "",
    });
    setShowForm(false);
    toast({
      title: "Tenant Added",
      description: `${tenant.name} has been added successfully.`,
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
          <form onSubmit={handleAddTenant} className="space-y-4">
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
                <Label htmlFor="roomNumber">Room Number</Label>
                <Select
                  value={newTenant.roomNumber}
                  onValueChange={(value) => setNewTenant({ ...newTenant, roomNumber: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a room" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="101">Room 101</SelectItem>
                    <SelectItem value="102">Room 102</SelectItem>
                    <SelectItem value="103">Room 103</SelectItem>
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
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Tenant</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tenants.map((tenant) => (
          <Card key={tenant.id} className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">{tenant.name}</h3>
                <span className="text-sm text-gray-500">Room {tenant.roomNumber}</span>
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
        ))}
      </div>
    </div>
  );
};

export default Tenants;