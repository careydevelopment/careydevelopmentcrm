import { Contact } from "../../contacts/models/contact";
import { ActivityOutcome } from "./activity-outcome";
import { ActivityType } from "./activity-type";

export interface Activity {
  id: string;
  title: string;
  type: ActivityType;
  outcome: ActivityOutcome;
  notes: string;
  location: string;
  startDate: number;
  endDate: number;
  contact: Contact;
}
