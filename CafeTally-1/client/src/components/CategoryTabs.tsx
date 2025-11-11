import { Button } from "@/components/ui/button";

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export default function CategoryTabs({ categories, activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 px-1" data-testid="container-categorytabs">
      <Button
        variant={activeCategory === null ? "default" : "secondary"}
        size="sm"
        onClick={() => onCategoryChange(null)}
        data-testid="button-category-all"
        className="whitespace-nowrap"
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "default" : "secondary"}
          size="sm"
          onClick={() => onCategoryChange(category)}
          data-testid={`button-category-${category.toLowerCase()}`}
          className="whitespace-nowrap"
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
