import { ContactLightweight } from "./contact-lightweight";
import { ActivityOutcome } from "./activity-outcome";
import { ActivityTypeLightweight } from "./activity-type-lightweight";
import { DealLightweight } from "../../deals/models/deal-lightweight";

export interface Activity {
  id: string;
  title: string;
  type: ActivityTypeLightweight;
  outcome: ActivityOutcome;
  notes: string;
  location: string;
  startDate: number;
  endDate: number;
  contact: ContactLightweight;
  deal: DealLightweight;
  status: string;
}
