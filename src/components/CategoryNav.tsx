import { Button } from "@/components/ui/button";
import { CategoryNavProps } from "@/types/news";

export const CategoryNav = ({ categories, selectedCategory, onSelectCategory }: CategoryNavProps) => {
  return (
    <nav className="space-y-2">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </Button>
      ))}
    </nav>
  );
};