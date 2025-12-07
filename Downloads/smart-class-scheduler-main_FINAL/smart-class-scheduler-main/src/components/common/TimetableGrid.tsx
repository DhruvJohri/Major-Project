import { cn } from '@/lib/utils';
import { TimetableSlot } from '@/types';

interface TimetableGridProps {
  slots: TimetableSlot[];
  days: string[];
  timeslots: string[];
  onSlotClick?: (day: string, slotIndex: number) => void;
  editable?: boolean;
}

export function TimetableGrid({
  slots,
  days,
  timeslots,
  onSlotClick,
  editable = false,
}: TimetableGridProps) {
  const getSlot = (day: string, slotIndex: number) => {
    return slots.find((s) => s.day === day && s.slotIndex === slotIndex);
  };

  const getSlotColor = (slotIndex: number) => {
    const colors = [
      'bg-primary/10 border-primary/20 text-primary',
      'bg-accent/10 border-accent/20 text-accent',
      'bg-success/10 border-success/20 text-success',
      'bg-warning/10 border-warning/20 text-warning',
      'bg-chart-1/10 border-chart-1/20 text-chart-1',
      'bg-chart-2/10 border-chart-2/20 text-chart-2',
    ];
    return colors[slotIndex % colors.length];
  };

  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="w-24 p-3 text-left text-sm font-medium text-muted-foreground">
              Time
            </th>
            {days.map((day) => (
              <th
                key={day}
                className="p-3 text-center text-sm font-medium text-muted-foreground"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeslots.map((time, slotIndex) => (
            <tr key={time} className="border-b last:border-0">
              <td className="p-3 text-sm font-medium text-muted-foreground">
                {time}
              </td>
              {days.map((day) => {
                const slot = getSlot(day, slotIndex);
                return (
                  <td
                    key={`${day}-${slotIndex}`}
                    className={cn(
                      'p-2 transition-colors',
                      editable && 'cursor-pointer hover:bg-muted/50'
                    )}
                    onClick={() =>
                      editable && onSlotClick?.(day, slotIndex)
                    }
                  >
                    {slot ? (
                      <div
                        className={cn(
                          'rounded-lg border p-3 transition-all hover:scale-[1.02]',
                          getSlotColor(slotIndex)
                        )}
                      >
                        <p className="font-semibold text-sm">
                          {slot.course.code}
                        </p>
                        <p className="text-xs opacity-80 truncate">
                          {slot.course.name}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          <span className="inline-flex items-center rounded-full bg-background/50 px-2 py-0.5 text-xs">
                            {slot.room.name}
                          </span>
                          {slot.teacher && (
                            <span className="inline-flex items-center rounded-full bg-background/50 px-2 py-0.5 text-xs truncate max-w-[100px]">
                              {slot.teacher.user?.name?.split(' ')[0] || 'TBA'}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="min-h-[80px] rounded-lg border border-dashed border-border/50 flex items-center justify-center">
                        {editable && (
                          <span className="text-xs text-muted-foreground">
                            Click to add
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
