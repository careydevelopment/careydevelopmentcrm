import { Address } from './address';
import { Phone } from './phone';
import { SalesOwner } from './sales-owner';

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
    company: string;
    status: string;
    statusChange: number;
    salesOwner: SalesOwner;
}
