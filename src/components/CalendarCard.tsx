import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCardProps } from "@/types/news";
import { format } from "date-fns";

export const CalendarCard = ({ title, date, description, type }: CalendarCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {format(date, 'PPP')}
          </p>
          <p className="text-sm">{description}</p>
          <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
            {type}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};