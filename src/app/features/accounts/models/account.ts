import { Address } from "../../../models/address";
import { Phone } from "../../../models/phone";
import { SalesOwner } from "../../../models/sales-owner";


export interface Account {
  id: string;
  name: string;
  address: Address;
  phone: Phone;
  industry: string;
  description: string;
  numberOfEmployees: number;
  stockSymbol: string;
  annualRevenue: number;
  status: string;
  source: string;
  salesOwner: SalesOwner;
}
