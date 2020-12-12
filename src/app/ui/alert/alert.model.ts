export class Alert {
  id: string;
  message: string;
  autoClose: boolean;
  fade: boolean;
  alertType: string;
  keepAfterRouteChange: boolean = false;

  constructor(init?:Partial<Alert>) {
    Object.assign(this, init);
  }
}

