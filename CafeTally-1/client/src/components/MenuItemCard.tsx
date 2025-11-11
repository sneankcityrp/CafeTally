import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface MenuItemCardProps {
  id: string;
  name: string;
  price: number;
  category: string;
  onAdd: (id: string, name: string, price: number) => void;
}

export default function MenuItemCard({ id, name, price, category, onAdd }: MenuItemCardProps) {
  const handleAdd = () => {
    onAdd(id, name, price);
  };

  return (
    <Card className="p-4 flex flex-col gap-3 hover-elevate active-elevate-2 cursor-pointer" onClick={handleAdd} data-testid={`card-menuitem-${id}`}>
      <div className="flex flex-col gap-1 flex-1">
        <h3 className="font-semibold text-lg leading-tight" data-testid={`text-itemname-${id}`}>{name}</h3>
        <p className="text-sm text-muted-foreground" data-testid={`text-category-${id}`}>{category}</p>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-2xl font-bold" data-testid={`text-price-${id}`}>£{price.toFixed(2)}</span>
        <Button size="icon" variant="default" onClick={(e) => { e.stopPropagation(); handleAdd(); }} data-testid={`button-add-${id}`}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
