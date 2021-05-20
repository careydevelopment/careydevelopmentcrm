export class ActivitySearchCriteria {
  dealId: string = '';
  contactId: string = '';
  minDate: number = 0;
  maxDate: number = 20000000000000;
  orderBy: string = 'startDate';
  orderType: string = 'DESC';
  maxResults: number = 50;
  salesOwnerId: string = '';
}
