
import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  handleCategorySelect: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  handleCategorySelect,
}) => {
  return (
    <ScrollArea className="w-full whitespace-nowrap pb-2">
      <div className="flex px-4 space-x-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategorySelect(category)}
            className={
              selectedCategory === category
                ? "bg-blue-500 text-white flex-shrink-0"
                : "text-gray-700 flex-shrink-0"
            }
          >
            {category}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
};
