import { ActivityOutcome } from "./activity-outcome";
import { ActivityTypeLightweight } from "./activity-type-lightweight";

export interface ActivityType extends ActivityTypeLightweight {
  requiresOutcome: boolean;
  usesLocation: boolean;
  possibleOutcomes: ActivityOutcome[];
  usesEndDate: boolean;
}
