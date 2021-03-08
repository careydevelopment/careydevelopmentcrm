import { Price } from './price';

export interface Product {
  id: string;
  name: string;
  description: string;
  lineOfBusiness: string;
  productType: string;
  prices: Price[];
}
