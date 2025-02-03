import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useStore } from "@/lib/store";
import { Room } from "@/lib/types";

const Rooms = () => {
  const { toast } = useToast();
  const { rooms, addRoom, updateRoom, deleteRoom } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [newRoom, setNewRoom] = useState({
    floor: "",
    roomNumber: "",
    totalBeds: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for duplicate room number
    const isDuplicate = rooms.some(
      (room) => 
        room.roomNumber === newRoom.roomNumber && 
        (!editingRoom || room.id !== editingRoom.id)
    );

    if (isDuplicate) {
      toast({
        title: "Error",
        description: "A room with this number already exists.",
        variant: "destructive",
      });
      return;
    }

    const roomData = {
      id: editingRoom?.id || Date.now().toString(),
      floor: Number(newRoom.floor),
      roomNumber: newRoom.roomNumber,
      totalBeds: Number(newRoom.totalBeds),
      occupiedBeds: editingRoom?.occupiedBeds || 0,
    };

    if (editingRoom) {
      updateRoom(roomData);
      toast({
        title: "Room Updated",
        description: `Room ${roomData.roomNumber} has been updated.`,
      });
    } else {
      addRoom(roomData);
      toast({
        title: "Room Added",
        description: `Room ${roomData.roomNumber} has been added.`,
      });
    }

    setNewRoom({ floor: "", roomNumber: "", totalBeds: "" });
    setEditingRoom(null);
    setShowForm(false);
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setNewRoom({
      floor: room.floor.toString(),
      roomNumber: room.roomNumber,
      totalBeds: room.totalBeds.toString(),
    });
    setShowForm(true);
  };

  const handleDelete = (room: Room) => {
    if (room.occupiedBeds > 0) {
      toast({
        title: "Cannot Delete Room",
        description: "This room has occupied beds. Please relocate tenants first.",
        variant: "destructive",
      });
      return;
    }
    deleteRoom(room.id);
    toast({
      title: "Room Deleted",
      description: `Room ${room.roomNumber} has been deleted.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Rooms</h1>
          <p className="text-gray-500">Manage your hostel rooms here</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Room
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="floor">Floor Number</Label>
                <Input
                  id="floor"
                  type="number"
                  value={newRoom.floor}
                  onChange={(e) => setNewRoom({ ...newRoom, floor: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomNumber">Room Number</Label>
                <Input
                  id="roomNumber"
                  value={newRoom.roomNumber}
                  onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalBeds">Total Beds</Label>
                <Input
                  id="totalBeds"
                  type="number"
                  value={newRoom.totalBeds}
                  onChange={(e) => setNewRoom({ ...newRoom, totalBeds: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowForm(false);
                  setEditingRoom(null);
                  setNewRoom({ floor: "", roomNumber: "", totalBeds: "" });
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingRoom ? "Update Room" : "Add Room"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <Card key={room.id} className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">Room {room.roomNumber}</h3>
                  <p className="text-sm text-gray-500">Floor {room.floor}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(room)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(room)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Beds: {room.occupiedBeds}/{room.totalBeds}</span>
                <span className={room.occupiedBeds === room.totalBeds ? "text-red-500" : "text-green-500"}>
                  {room.occupiedBeds === room.totalBeds ? "Full" : "Available"}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Rooms;