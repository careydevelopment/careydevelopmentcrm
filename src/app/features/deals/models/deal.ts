import { ContactLightweight } from './contact-lightweight';
import { Product } from './product';
import { DealStage } from './deal-stage';

export interface Deal {
  id: string;
  name: string;
  description: string;
  product: Product;
  contact: ContactLightweight;
  units: number;
  stage: DealStage;
  expectedClosureDate: number;
}
