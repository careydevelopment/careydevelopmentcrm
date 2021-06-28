import { ErrorFieldMessage } from "carey-validation";

/**
 * Additional summary messages identified per field.
 *
 * These are the messages that usually appear at the bottom of
 * an invalid form in list item format.
 *
 * These are in addition to the standard summary messages identified
 * in allFieldMessages in carey-validation.
 * */
export const allFieldSummaries: ErrorFieldMessage[] = [
  {
    field: "source",
    message: "Please enter a valid source"
  },
  {
    field: "status",
    message: "Please enter a valid status"
  },
  {
    field: "account",
    message: "Please enter a valid account"
  }
];
