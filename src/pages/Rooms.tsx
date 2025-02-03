import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Room {
  id: string;
  floor: number;
  roomNumber: string;
  totalBeds: number;
  occupiedBeds: number;
}

const Rooms = () => {
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newRoom, setNewRoom] = useState({
    floor: "",
    roomNumber: "",
    totalBeds: "",
  });

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const room: Room = {
      id: Date.now().toString(),
      floor: Number(newRoom.floor),
      roomNumber: newRoom.roomNumber,
      totalBeds: Number(newRoom.totalBeds),
      occupiedBeds: 0,
    };
    setRooms([...rooms, room]);
    setNewRoom({ floor: "", roomNumber: "", totalBeds: "" });
    setShowForm(false);
    toast({
      title: "Room Added",
      description: `Room ${room.roomNumber} has been added successfully.`,
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
          <form onSubmit={handleAddRoom} className="space-y-4">
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
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Room</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <Card key={room.id} className="p-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Room {room.roomNumber}</h3>
              <p className="text-sm text-gray-500">Floor {room.floor}</p>
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