import { Address } from './address';
import { Phone } from './phone';
import { SalesOwner } from './sales-owner';
import { Account } from './account';

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phones: Phone[];
  addresses: Address[];
  source: string;
  sourceDetails: string;
  linesOfBusiness: string[];
  authority: boolean;
  title: string;
  status: string;
  statusChange: number;
  salesOwner: SalesOwner;
  account: Account;
  tags: string[];
}
