import { ContactLightweight } from './contact-lightweight';
import { Product } from './product';
import { DealStage } from './deal-stage';
import { DealLightweight } from './deal-lightweight';

export interface Deal extends DealLightweight {
  product: Product;
  contact: ContactLightweight;
  units: number;
  stage: DealStage;
  expectedClosureDate: number;
}
