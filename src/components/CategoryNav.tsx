import { Button } from "@/components/ui/button";

interface CategoryNavProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryNav = ({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryNavProps) => {
  return (
    <nav className="w-full overflow-x-auto py-4 mb-6 sticky top-0 bg-white/80 backdrop-blur-sm z-10">
      <div className="flex space-x-2 min-w-max px-4">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            onClick={() => onCategoryChange(category)}
            className="transition-all duration-200"
          >
            {category}
          </Button>
        ))}
      </div>
    </nav>
  );
};