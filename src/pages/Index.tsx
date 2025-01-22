import { useState, useEffect } from "react";
import { CategoryNav } from "@/components/CategoryNav";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { NewsSection } from "@/components/NewsSection";
import { AdvertisementSection } from "@/components/AdvertisementSection";
import { EventsSection } from "@/components/EventsSection";

const categories = [
  "Today's News",
  "Top Stories",
  "Technology",
  "Business",
  "Entertainment",
  "Sports",
  "World",
  "Science",
  "Health"
];

const newsAgencies = [
  { id: 'guardian', name: 'The Guardian' },
  { id: 'newsapi', name: 'News API' },
  { id: 'custom', name: 'The News API' }
];

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState("Today's News");
  const [selectedNewsAgency, setSelectedNewsAgency] = useState('guardian');

  return (
    <div className="container mx-auto px-4 py-8">
      <AdvertisementSection />
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-1/4">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Select News Source</label>
            <Select value={selectedNewsAgency} onValueChange={setSelectedNewsAgency}>
              <SelectTrigger>
                <SelectValue placeholder="Select a news source" />
              </SelectTrigger>
              <SelectContent>
                {newsAgencies.map((agency) => (
                  <SelectItem key={agency.id} value={agency.id}>
                    {agency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <CategoryNav
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <EventsSection />
        </aside>
        <main className="md:w-3/4 h-[calc(100vh-8rem)]">
          <NewsSection 
            selectedCategory={selectedCategory}
            selectedNewsAgency={selectedNewsAgency}
          />
        </main>
      </div>
    </div>
  );
}