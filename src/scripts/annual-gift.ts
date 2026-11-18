import {
  DonationAmount,
  DonationFrequency,
  EnForm,
  EngridLogger,
  ProcessingFees,
} from "@4site/engrid-scripts";

// Supporter fields filled in for annual gifts, as on the legacy donation page
const ANNUAL_DONORS_FIELD = "supporter.questions.1167119"; // "Annual donors" opt-in
const ANNUAL_GIFT_DATE_FIELD = "supporter.NOT_TAGGED_36"; // "Annual Gift Date"
const ANNUAL_GIFT_AMOUNT_FIELD = "supporter.NOT_TAGGED_37"; // "Annual Gift Amount"

/**
 * For annual gifts, sends:
 * - "Annual donors" opt-in: Y
 * - "Annual Gift Date": today, as MM/DD
 * - "Annual Gift Amount": the gift total, processing fee included, formatted
 *   like the legacy page ("$51.50")
 * For any other frequency none of them are sent, so values saved from an
 * earlier annual gift aren't overwritten. Each field has to be on the form
 * (hidden) for Engaging Networks to save it.
 */
export class AnnualGift {
  private logger: EngridLogger = new EngridLogger(
    "AnnualGift",
    "white",
    "green",
    "📅"
  );
  private frequency: DonationFrequency = DonationFrequency.getInstance();

  constructor() {
    if (!document.getElementsByName("transaction.recurrfreq").length) return;
    const fields = [
      ANNUAL_DONORS_FIELD,
      ANNUAL_GIFT_DATE_FIELD,
      ANNUAL_GIFT_AMOUNT_FIELD,
    ];
    const missing = fields.filter((name) => !this.getFields(name).length);
    if (missing.length) {
      this.logger.log(`Not on this form: ${missing.join(", ")}`);
    }
    if (missing.length === fields.length) return;

    this.update();
    this.frequency.onFrequencyChange.subscribe(() => this.update());
    DonationAmount.getInstance().onAmountChange.subscribe(() => this.update());
    document.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement | null;
      if (target?.name === "transaction.feeCover") this.update();
    });
    // Runs again right before the gift is sent, digital wallets included
    EnForm.getInstance().onIntentSubmit.subscribe(() => this.update());
  }

  private getFields(name: string): HTMLElement[] {
    return Array.from(document.getElementsByName(name));
  }

  private update(): void {
    // ENgrid stores the frequency in lowercase
    const isAnnual = this.frequency.frequency === "annual";
    this.setOptIn(isAnnual);
    this.setValue(ANNUAL_GIFT_DATE_FIELD, isAnnual ? this.getDate() : null);
    this.setValue(ANNUAL_GIFT_AMOUNT_FIELD, isAnnual ? this.getAmount() : null);
    this.logger.log(
      isAnnual
        ? `Annual gift: opt-in Y, date ${this.getDate()}, amount ${this.getAmount()}`
        : "Not an annual gift: annual fields won't be sent"
    );
  }

  private setOptIn(isAnnual: boolean): void {
    this.getFields(ANNUAL_DONORS_FIELD).forEach((field) => {
      if (
        field instanceof HTMLInputElement &&
        (field.type === "radio" || field.type === "checkbox")
      ) {
        // Unchecked radios and checkboxes aren't sent
        field.checked = isAnnual && field.value.toUpperCase() === "Y";
      } else {
        this.setFieldValue(field, isAnnual ? "Y" : null);
      }
    });
  }

  private setValue(name: string, value: string | null): void {
    this.getFields(name).forEach((field) => this.setFieldValue(field, value));
  }

  // A null value disables the field, and disabled fields aren't sent
  private setFieldValue(field: HTMLElement, value: string | null): void {
    if (
      field instanceof HTMLInputElement ||
      field instanceof HTMLSelectElement ||
      field instanceof HTMLTextAreaElement
    ) {
      if (value !== null) field.value = value;
      field.disabled = value === null;
    }
  }

  // Same format as the legacy page: MM/DD, no year
  private getDate(): string {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${month}/${day}`;
  }

  // Same value and format as Engaging Networks' {amount-total} token
  private getAmount(): string {
    const enjs = (window as any).EngagingNetworks?.require?._defined?.enjs;
    const total =
      typeof enjs?.getDonationTotal === "function"
        ? Number(enjs.getDonationTotal())
        : DonationAmount.getInstance().amount +
          ProcessingFees.getInstance().fee;
    const currency =
      enjs?.getSupporterData?.("paycurrency") ||
      enjs?.getSupporterData?.("currency") ||
      "USD";
    return total.toLocaleString((window as any).pageJson?.locale || "en-US", {
      style: "currency",
      currency,
    });
  }
}
