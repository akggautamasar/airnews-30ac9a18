import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarHeart } from "lucide-react";

interface CalendarCardProps {
  title: string;
  date: string;
  description: string;
  type: string;
}

export const CalendarCard = ({
  title,
  date,
  description,
  type,
}: CalendarCardProps) => {
  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden animate-slideUp hover:shadow-lg transition-shadow duration-200">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/4 bg-primary/5 flex items-center justify-center p-6">
          <CalendarHeart className="h-12 w-12 text-primary" />
        </div>
        <div className="md:w-3/4 p-6">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-xl font-bold mb-3 line-clamp-2">{title}</h2>
            <Badge variant="outline">{type}</Badge>
          </div>
          <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>
          <div className="text-sm text-gray-500">
            <span>{new Date(date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};