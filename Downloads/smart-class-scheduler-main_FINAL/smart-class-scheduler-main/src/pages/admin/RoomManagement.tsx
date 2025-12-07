import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { mockRooms } from '@/data/mockData';
import { Room } from '@/types';
const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:5000';
import { Plus, Pencil, Trash2, Upload, Download, DoorOpen } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function RoomManagement() {
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  useEffect(()=>{
    const fetchRooms = async ()=>{
      try{
        const res = await fetch(`${API_BASE}/api/rooms`);
        if(res.ok){ const rs = await res.json(); const normalized = rs.map((r:any)=> ({ ...r, id: r._id || r.id })); setRooms(normalized); }
      }catch(e){ console.warn('Failed to fetch rooms', e); }
    };
    fetchRooms();
  },[]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Lecture' as 'Lecture' | 'Lab' | 'Seminar',
    capacity: 60,
    department: 'CSE',
    isAvailable: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    (async ()=>{
      try{
        if(editingRoom){
          const res = await fetch(`${API_BASE}/api/rooms/${editingRoom.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
          const updated = await res.json();
          const normalized = { ...updated, id: updated._id || updated.id };
          setRooms(rooms.map(r=> r.id === editingRoom.id ? normalized : r));
          toast({ title: 'Room Updated', description: `${formData.name} has been updated.` });
        } else {
          const res = await fetch(`${API_BASE}/api/rooms`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
          const created = await res.json();
          const normalized = { ...created, id: created._id || created.id };
          setRooms([...rooms, normalized]);
          toast({ title: 'Room Added', description: `${formData.name} has been added.` });
        }
      }catch(e){ console.error(e); toast({ title: 'Error', description: 'Failed to save room', variant: 'destructive' }); }
      finally{ resetForm(); }
    })();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'Lecture',
      capacity: 60,
      department: 'CSE',
      isAvailable: true,
    });
    setEditingRoom(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      type: room.type,
      capacity: room.capacity,
      department: room.department || 'CSE',
      isAvailable: room.isAvailable,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    (async ()=>{
      try{
        const res = await fetch(`${API_BASE}/api/rooms/${id}`, { method: 'DELETE' });
        if(res.ok){ setRooms(rooms.filter(r => r.id !== id)); toast({ title: 'Room Removed', description: 'The room has been removed.' }); }
        else throw new Error('Delete failed');
      }catch(e){ console.error(e); toast({ title: 'Delete Failed', description: 'Unable to remove room', variant: 'destructive' }); }
    })();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Lecture': return 'bg-primary/10 text-primary';
      case 'Lab': return 'bg-accent/10 text-accent';
      case 'Seminar': return 'bg-success/10 text-success';
      default: return '';
    }
  };

  const columns = [
    { 
      key: 'name', 
      header: 'Room Name',
      render: (room: Room) => (
        <div className="flex items-center gap-2">
          <DoorOpen className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{room.name}</span>
        </div>
      ),
    },
    { 
      key: 'type', 
      header: 'Type',
      render: (room: Room) => (
        <Badge className={getTypeColor(room.type)} variant="secondary">
          {room.type}
        </Badge>
      ),
    },
    { 
      key: 'capacity', 
      header: 'Capacity',
      render: (room: Room) => `${room.capacity} seats`,
    },
    { 
      key: 'department', 
      header: 'Department',
      render: (room: Room) => (
        <Badge variant="outline">{room.department || 'General'}</Badge>
      ),
    },
    { 
      key: 'isAvailable', 
      header: 'Status',
      render: (room: Room) => (
        <Badge variant={room.isAvailable ? 'default' : 'secondary'}>
          {room.isAvailable ? 'Available' : 'Unavailable'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (room: Room) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(room)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(room.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Room Management"
        description="Manage lecture halls, labs, and seminar rooms"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Import Excel
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Room
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingRoom ? 'Edit Room' : 'Add New Room'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingRoom
                      ? 'Update the room details below.'
                      : 'Fill in the details to add a new room.'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Room Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="LH-101"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Room Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(v) => setFormData({ ...formData, type: v as 'Lecture' | 'Lab' | 'Seminar' })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Lecture">Lecture Hall</SelectItem>
                          <SelectItem value="Lab">Laboratory</SelectItem>
                          <SelectItem value="Seminar">Seminar Room</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Capacity</Label>
                      <Input
                        id="capacity"
                        type="number"
                        min={1}
                        max={500}
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select
                        value={formData.department}
                        onValueChange={(v) => setFormData({ ...formData, department: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="General">General</SelectItem>
                          {['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT'].map((dept) => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <Label htmlFor="isAvailable">Availability</Label>
                      <p className="text-xs text-muted-foreground">
                        Room can be scheduled for classes
                      </p>
                    </div>
                    <Switch
                      id="isAvailable"
                      checked={formData.isAvailable}
                      onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked })}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingRoom ? 'Update Room' : 'Add Room'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      <DataTable
        data={rooms}
        columns={columns}
        searchPlaceholder="Search rooms..."
      />
    </div>
  );
}
