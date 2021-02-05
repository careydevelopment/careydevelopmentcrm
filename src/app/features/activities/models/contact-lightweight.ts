import { AccountLightweight } from './account-lightweight';

export interface ContactLightweight {
  id: string;
  firstName: string;
  lastName: string;
  account: AccountLightweight;
}
