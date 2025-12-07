import { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Send, Users, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  title: string;
  message: string;
  audience: string;
  createdAt: string;
  status: 'sent' | 'scheduled' | 'draft';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Semester Exams Schedule Released',
    message: 'The examination schedule for the current semester has been released. Please check the portal for your exam dates.',
    audience: 'All Students',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'sent',
  },
  {
    id: '2',
    title: 'Faculty Meeting Tomorrow',
    message: 'Reminder: There will be a faculty meeting tomorrow at 10:00 AM in the Conference Hall.',
    audience: 'All Teachers',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: 'sent',
  },
  {
    id: '3',
    title: 'Holiday Announcement',
    message: 'The institution will remain closed on Friday for the upcoming festival.',
    audience: 'Everyone',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    status: 'sent',
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    audience: 'Everyone',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newNotification: Notification = {
      id: Date.now().toString(),
      title: formData.title,
      message: formData.message,
      audience: formData.audience,
      createdAt: new Date().toISOString(),
      status: 'sent',
    };

    setNotifications([newNotification, ...notifications]);
    setFormData({ title: '', message: '', audience: 'Everyone' });
    
    toast({
      title: 'Notification Sent',
      description: `Your notification has been sent to ${formData.audience}.`,
    });
  };

  const getAudienceIcon = (audience: string) => {
    switch (audience) {
      case 'All Students':
        return '🎓';
      case 'All Teachers':
        return '👨‍🏫';
      default:
        return '📢';
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Notifications"
        description="Send announcements and updates to students and faculty"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Create Notification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Create Notification
            </CardTitle>
            <CardDescription>
              Compose and send a new notification to your audience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Notification title..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="audience">Audience</Label>
                <Select
                  value={formData.audience}
                  onValueChange={(v) => setFormData({ ...formData, audience: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Everyone">Everyone</SelectItem>
                    <SelectItem value="All Students">All Students</SelectItem>
                    <SelectItem value="All Teachers">All Teachers</SelectItem>
                    <SelectItem value="CSE Department">CSE Department</SelectItem>
                    <SelectItem value="ECE Department">ECE Department</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write your notification message..."
                  rows={5}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Send Notification
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Notifications
            </CardTitle>
            <CardDescription>
              View previously sent notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getAudienceIcon(notification.audience)}</span>
                        <h4 className="font-medium">{notification.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 pt-2">
                        <Badge variant="secondary" className="text-xs">
                          <Users className="mr-1 h-3 w-3" />
                          {notification.audience}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant={notification.status === 'sent' ? 'default' : 'secondary'}
                      className="shrink-0"
                    >
                      {notification.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
