import { Contact } from "../../contacts/models/contact";
import { ActivityOutcome } from "./activity-outcome";
import { ActivityTypeLightweight } from "./activity-type-lightweight";

export interface Activity {
  id: string;
  title: string;
  type: ActivityTypeLightweight;
  outcome: ActivityOutcome;
  notes: string;
  location: string;
  date: number;
  contact: Contact;
}
