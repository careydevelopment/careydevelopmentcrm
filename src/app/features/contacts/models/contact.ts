import { Address } from '../../../models/address';
import { Phone } from '../../../models/phone';
import { SalesOwner } from '../../../models/sales-owner';
import { Account } from '../../accounts/models/account';

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
  timezone: string;
  tags: string[];
  canCall: boolean;
  canText: boolean;
  canEmail: boolean;
  birthdayMonth: string;
  birthdayDay: number;
  notes;
}
