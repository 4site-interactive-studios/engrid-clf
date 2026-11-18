import { DonationFrequency, EnForm, EngridLogger } from "@4site/engrid-scripts";

// Hidden "Annual donors" opt-in question in Engaging Networks
const ANNUAL_DONORS_FIELD = "supporter.questions.1167119";

/**
 * Answers the hidden "Annual donors" opt-in question with Y when the gift is
 * annual. For any other frequency the question isn't sent, so a Y saved from
 * an earlier annual gift isn't overwritten. The question has to be on the
 * form (hidden) for Engaging Networks to save it.
 */
export class AnnualDonorsOptIn {
  private logger: EngridLogger = new EngridLogger(
    "AnnualDonorsOptIn",
    "white",
    "green",
    "📅"
  );
  private frequency: DonationFrequency = DonationFrequency.getInstance();

  constructor() {
    if (!document.getElementsByName("transaction.recurrfreq").length) return;
    if (!this.getFields().length) {
      this.logger.log(`${ANNUAL_DONORS_FIELD} isn't on this form`);
      return;
    }
    this.update();
    this.frequency.onFrequencyChange.subscribe(() => this.update());
    // Runs again right before the gift is sent, digital wallets included
    EnForm.getInstance().onIntentSubmit.subscribe(() => this.update());
  }

  private getFields(): HTMLElement[] {
    return Array.from(document.getElementsByName(ANNUAL_DONORS_FIELD));
  }

  private update(): void {
    const isAnnual = this.frequency.frequency === "annual";
    this.getFields().forEach((field) => {
      if (
        field instanceof HTMLInputElement &&
        (field.type === "radio" || field.type === "checkbox")
      ) {
        // Unchecked radios and checkboxes aren't sent
        field.checked = isAnnual && field.value.toUpperCase() === "Y";
      } else if (
        field instanceof HTMLInputElement ||
        field instanceof HTMLSelectElement
      ) {
        // Hidden, text or select field: disabled fields aren't sent
        field.value = "Y";
        field.disabled = !isAnnual;
      }
    });
    this.logger.log(
      isAnnual
        ? "Annual gift: Annual donors opt-in set to Y"
        : "Not an annual gift: Annual donors opt-in won't be sent"
    );
  }
}
