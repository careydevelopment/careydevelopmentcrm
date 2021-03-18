export class DealCriteria {
  userId: string;
  orderBy: string = 'expectedClosureDate';
  orderType: string = 'DESC';
  maxResults: number = 20;
  minDate: number = 0;
  maxDate: number = 20000000000000;
}
