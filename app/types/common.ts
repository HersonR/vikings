import { products } from "@prisma/client";

export type ProductViewModel = Omit<products, 'minimum_stock_threshold' | 'stock_quantity' | 'unit_price' | 'created_at' | 'updated_at'> & {
  minimum_stock_threshold: string;
  stock_quantity: string;
  unit_price: string;
}

export type IconProps = {
  width?: number | string;
  height?: number | string;
  fill?: string;
  stroke?: string;
  className?: string;
  onClick?: React.MouseEventHandler<SVGSVGElement>;
  opacity?: number;
  inCircle?: boolean;
  strokeWidth?: number | string;
};