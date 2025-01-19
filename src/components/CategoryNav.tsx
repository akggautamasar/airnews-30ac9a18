import { Button } from "@/components/ui/button";
import { CategoryNavProps } from "@/types/news";
import { motion } from "framer-motion";

export const CategoryNav = ({ categories, selectedCategory, onSelectCategory }: CategoryNavProps) => {
  return (
    <motion.nav 
      className="space-y-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
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
    </motion.nav>
  );
};