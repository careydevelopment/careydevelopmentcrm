import { AccountLightweight } from './account-lightweight';
import { SalesOwnerLightweight } from './sales-owner-lightweight';

export interface ContactLightweight {
  id: string;
  firstName: string;
  lastName: string;
  account: AccountLightweight;
  salesOwner: SalesOwnerLightweight; 
}
