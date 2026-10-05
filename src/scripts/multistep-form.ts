import { ENGrid, EngridLogger } from "@4site/engrid-scripts";

declare global {
  interface Window {
    EngagingNetworks: any;
    EngridMultistepExpandVariant: boolean;
  }
}

interface ENValidator {
  isVisible: () => boolean;
  test: () => boolean;
  hideMessage: () => void;
  showMessage: () => void;
  field: number;
  type: string;
  format: string;
  message: string;
}

export default class MultistepForm {
  private logger: EngridLogger = new EngridLogger(
    "MultistepForm",
    "white",
    "blue"
  );
  private validators: Array<ENValidator> = [];
  private contentShouldExpand: boolean = false;

  constructor() {
    if (this.shouldRun()) {
      this.logger.log("MultistepForm running");
      if (
        ENGrid.checkNested(
          window.EngagingNetworks,
          "require",
          "_defined",
          "enValidation",
          "validation",
          "validators"
        )
      ) {
        this.validators =
          window.EngagingNetworks.require._defined.enValidation.validation.validators;
      }

      this.run();
      this.handleServerSideError();
    }
  }

  private shouldRun() {
    return (
      ENGrid.getPageType() === "DONATION" &&
      ENGrid.getBodyData("multistep") === "" &&
      ENGrid.getPageNumber() === 1
    );
  }

  private run() {
    if (window.EngridMultistepExpandVariant) {
      this.contentShouldExpand = true;
      ENGrid.setBodyData("multistep-expand", "true");
    }
    ENGrid.setBodyData("multistep-active-step", "1");
    this.addStepDataAttributes();
    this.addBackButtonToFinalStep();
    this.addEventListeners();
    this.renderOptIns();
    this.applyColorOverride();
  }

  private applyColorOverride() {
    const urlParams = new URLSearchParams(window.location.search);
    const color = urlParams.get("color");
    if (color) {
      document.body.style.setProperty("--color_primary", color);
      this.logger.log(`Overriding --color_primary with ${color}`);
    }
  }

  private renderOptIns() {
    // if .opt-ins
    if (document.querySelector(".opt-ins")) {
      // if label for en__field_supporter_questions_164260 - Change text content to "Email"
      const emailLabel = document.querySelector(
        "label[for='en__field_supporter_questions_164260']"
      );
      if (emailLabel) {
        emailLabel.textContent = "Email";
      }
      // if label for en__field_supporter_questions_707325 - Change text content to "Text Message"
      const textMessageLabel = document.querySelector(
        "label[for='en__field_supporter_questions_707325']"
      );
      if (textMessageLabel) {
        textMessageLabel.textContent = "Text Message";
      }
    }
  }

  private addStepDataAttributes() {
    if (ENGrid.getBodyData("layout") !== "centercenter2col") {
      document
        .querySelector(".body-title")
        ?.setAttribute("data-multistep-step", "1");
      document
        .querySelector(".body-top")
        ?.setAttribute("data-multistep-step", "1");
      document
        .querySelector(".body-bottom")
        ?.setAttribute("data-multistep-step", "4");
    }

    const stepperCodeBlocks = [
      ...document.querySelectorAll(".multistep-stepper"),
    ].map((el) => el.closest(".en__component--codeblock"));

    stepperCodeBlocks.forEach((step: any, index: number) => {
      step.setAttribute("data-multistep-step", `${index + 1}`);
      // if this is the first step, we start from the first element in ".body-main"
      // (since the first stepper could be outside of ".body-main")
      const start =
        index === 0 ? document.querySelector(".body-main")?.firstChild : step;
      const nextStep = stepperCodeBlocks[index + 1];
      const elements = this.getElementsBetween(start, nextStep);
      elements.forEach((element) => {
        element.setAttribute("data-multistep-step", `${index + 1}`);
      });
    });
  }

  private getElementsBetween(step: any, nextStep: any) {
    const elements = [];
    let currentElement = step.nextElementSibling;
    while (currentElement && currentElement !== nextStep) {
      elements.push(currentElement);
      currentElement = currentElement.nextElementSibling;
    }
    return elements;
  }

  private addEventListeners() {
    //Elements for changing step
    const buttons = document.querySelectorAll(
      "[data-multistep-change-step]"
    ) as NodeListOf<HTMLElement>;
    buttons.forEach((button) => {
      button.addEventListener("click", (e) => {
        if (
          button.closest(".en__field--giveBySelect, .give-by-select-wrapper")
        ) {
          window.setTimeout(() => {
            this.activateStep(button.dataset.multistepChangeStep ?? "");
          }, 0);
          return;
        }
        this.activateStep(button.dataset.multistepChangeStep ?? "");
      });
    });
  }

  private inIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  private scrollTo(where = 0) {
    if (this.inIframe()) {
      setTimeout(() => {
        window.parent.postMessage({ scrollTo: where }, "*");
      }, 200);
      this.logger.log("IS in an iFrame, scrolling to top");
    } else {
      window.scrollTo(0, where);
      this.logger.log("NOT in an iFrame, scrolling to top");
    }
  }

  private activateStep(targetStep: string, bypassValidation: boolean = false) {
    if (!targetStep) return;
    const activeStep = ENGrid.getBodyData("multistep-active-step") ?? "1";

    //If no validation or we're going backwards, activate the step
    if (bypassValidation || targetStep < activeStep) {
      this.logger.log(
        `Bypassing validation or going backwards. Activating step ${targetStep}`
      );
      ENGrid.setBodyData("multistep-active-step", targetStep);
      this.setGiveBySelectToCardOnStep2(targetStep);
      this.scrollViewport();
      return;
    }

    // If we're going forwards, validate the steps between the current and target step
    // if validation fields, find first error on the page, activate that step and scroll to it
    if (
      !this.validateStepsBetweenCurrentAndTargetStep(activeStep, targetStep)
    ) {
      const field: HTMLElement | null = document.querySelector(
        ".en__field--validationFailed"
      );
      const invalidStep =
        field
          ?.closest(".en__component--formblock")
          ?.getAttribute("data-multistep-step") ?? "1";
      ENGrid.setBodyData("multistep-active-step", invalidStep);
      this.setGiveBySelectToCardOnStep2(invalidStep);
      if (field) {
        const scrollToError = field ? field.getBoundingClientRect().top : 0;

        // Parent pages listens for this message and scrolls to the correct position
        if (this.inIframe()) {
          this.scrollTo(scrollToError);
          this.logger.log(
            `iFrame Event 'scrollTo' - Position of top of first error ${scrollTo} px`
          ); // check the message is being sent correctly
        } else {
          field.scrollIntoView({ behavior: "smooth" });
        }
      }
      this.logger.log(
        `Found error on step ${invalidStep}. Going to that step.`
      );
      return;
    }

    // If validation passes, activate the step
    this.logger.log(`Validation passed. Activating step ${targetStep}`);
    ENGrid.setBodyData("multistep-active-step", targetStep);
    this.setGiveBySelectToCardOnStep2(targetStep);
    if (this.inIframe()) {
      this.scrollTo();
      return;
    }
    this.scrollViewport();
  }

  private setGiveBySelectToCardOnStep2(step: string) {
    if (step !== "2") return;
    const cardRadio = Array.from(
      document.getElementsByName("transaction.giveBySelect")
    ).find(
      (radio) => (radio as HTMLInputElement).value.toLowerCase() === "card"
    ) as HTMLInputElement | undefined;
    if (!cardRadio) return;
    this.logger.log("Navigated to step 2. Setting giveBySelect to card.");
    cardRadio.click();
  }

  private scrollViewport() {
    // If the multistep form is in a content expand variant, scroll to top of the active step
    if (this.contentShouldExpand) {
      const scrollToEl = [
        ...document.querySelectorAll("[data-multistep-step]"),
      ].find((el) => {
        return (
          el.getAttribute("data-multistep-step") ===
          ENGrid.getBodyData("multistep-active-step")
        );
      });
      if (!scrollToEl) return;
      window.scrollTo({
        top: scrollToEl.getBoundingClientRect().top + window.pageYOffset,
        behavior: "smooth",
      });
      return;
    }

    /*
      If a .section-header is present and outside the viewport, we should scroll to the section header
      If a .section-header is present and in the viewport, then we should not scroll
      If no .section-header is present we should scroll to the top of the page
     */
    const sectionHeaders: NodeListOf<HTMLElement> =
      document.querySelectorAll(".section-header");
    const currentSectionHeader: HTMLElement | undefined = [
      ...sectionHeaders,
    ].find((el) => {
      const headerStep = el
        .closest("[data-multistep-step]")
        ?.getAttribute("data-multistep-step");
      return headerStep === ENGrid.getBodyData("multistep-active-step");
    });

    const steppers: NodeListOf<HTMLElement> =
      document.querySelectorAll(".multistep-stepper");
    const currentStepper: HTMLElement | undefined = [...steppers].find((el) => {
      const step = el
        .closest("[data-multistep-step]")
        ?.getAttribute("data-multistep-step");
      return step === ENGrid.getBodyData("multistep-active-step");
    });

    if (!currentSectionHeader || currentSectionHeader.offsetHeight === 0) {
      if (currentStepper && currentStepper.offsetHeight > 0) {
        this.logger.log(`No section header found. Scrolling to stepper.`);
        //HERE
        this.scrollTo(
          currentStepper.getBoundingClientRect().top + window.pageYOffset
        );
        return;
      }
      this.logger.log(
        `No section header or stepper found. Scrolling to top of page.`
      );

      this.scrollTo();
      return;
    }

    if (ENGrid.isInViewport(currentSectionHeader)) {
      if (this.inIframe()) {
        this.scrollTo();
        return;
      }
      this.logger.log(`Section header is in viewport. Not scrolling.`);
      return;
    }

    const offset = parseInt(getComputedStyle(currentSectionHeader).marginTop);
    this.logger.log(`Scrolling to section header. ${offset} offset.`);
    this.scrollTo(
      currentSectionHeader.getBoundingClientRect().top +
        window.pageYOffset -
        offset
    );
  }

  private addBackButtonToFinalStep() {
    const submitButtonContainer = document.querySelector(
      ".multistep-submit .en__submit"
    );
    if (!submitButtonContainer) return;
    submitButtonContainer.insertAdjacentHTML(
      "beforebegin",
      `<button class="btn-back" data-multistep-change-step="3" type="button">
      <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.75" style="mix-blend-mode:hard-light">
      <path d="M8.41406 1L1.41406 8L8.41406 15" stroke="white" stroke-width="2" stroke-linecap="round"/>
      </g>
      </svg>
       </button>`
    );
  }

  private validateStepsBetweenCurrentAndTargetStep(
    currentStep: string,
    targetStep: string
  ) {
    const stepsBetween = this.getStepsBetween(currentStep, targetStep);
    return stepsBetween.every((step) => this.validateStep(step));
  }

  private validateStep(step: string) {
    const enValidationPassed = this.validateEnValidators(step);
    const vgsCardFieldsPassed = this.validateVgsCardFields(step);
    return enValidationPassed && vgsCardFieldsPassed;
  }

  private validateEnValidators(step: string) {
    if (this.validators.length === 0) return true;

    const validators = this.validators.filter((validator) => {
      return (
        document
          .querySelector(`.en__field--${validator.field}`)
          ?.closest(".en__component--formblock")
          ?.getAttribute("data-multistep-step") === step
      );
    });

    const validationResults = validators.map((validator) => {
      validator.hideMessage();
      const passed = !validator.isVisible() || validator.test();
      this.setFieldLabelTitle(validator.field, passed ? "" : validator.message);
      return passed;
    });

    return validationResults.every((result) => result);
  }

  private setFieldLabelTitle(fieldId: number, message: string) {
    const label = document.querySelector(
      `.en__field--${fieldId} .en__field__label`
    );
    if (!label) return;
    if (message) {
      label.setAttribute("title", message);
    } else {
      label.removeAttribute("title");
    }
  }

  private validateVgsCardFields(step: string) {
    const ccnumberBlock = document.querySelector(".en__field--ccnumber");
    if (!ccnumberBlock) return true;

    const ccnumberStep = ccnumberBlock
      .closest("[data-multistep-step]")
      ?.getAttribute("data-multistep-step");
    if (ccnumberStep !== step) return true;

    if (!this.isCardPayment()) {
      this.clearVgsCardFieldErrors();
      return true;
    }

    let allValid = true;
    ["ccnumber", "ccexpire", "ccvv"].forEach((fieldName) => {
      const field = document.querySelector(
        `#en__field_transaction_${fieldName}`
      );
      const block = document.querySelector(`.en__field--${fieldName}`);
      if (!field || !block) return;

      const isValid =
        field instanceof HTMLInputElement
          ? !!field.value
          : field.classList.contains("vgs-collect-container__valid");

      if (isValid) {
        block.classList.remove("has-error", "en__field--validationFailed");
      } else {
        block.classList.add("has-error", "en__field--validationFailed");
        allValid = false;
      }
    });

    return allValid;
  }

  private isCardPayment() {
    const giveBySelect = document.querySelector(
      "input[name='transaction.giveBySelect']:checked"
    ) as HTMLInputElement | null;
    if (giveBySelect?.value) {
      return giveBySelect.value.toLowerCase() === "card";
    }

    const paymentTypeField = document.querySelector(
      "#en__field_transaction_paymenttype"
    ) as HTMLInputElement | HTMLSelectElement | null;
    if (paymentTypeField?.value) {
      return ["vi", "mc", "di", "ax"].includes(
        paymentTypeField.value.toLowerCase()
      );
    }

    return true;
  }

  private clearVgsCardFieldErrors() {
    ["ccnumber", "ccexpire", "ccvv"].forEach((fieldName) => {
      document
        .querySelector(`.en__field--${fieldName}`)
        ?.classList.remove("has-error", "en__field--validationFailed");
    });
  }

  private getStepsBetween(currentStep: string, targetStep: string) {
    const start = parseInt(currentStep);
    const end = parseInt(targetStep);
    let stepsBetween = [];

    for (let i = start; i < end; i++) {
      stepsBetween.push(i.toString());
    }

    return stepsBetween;
  }

  private handleServerSideError() {
    if (
      ENGrid.checkNested(
        window.EngagingNetworks,
        "require",
        "_defined",
        "enjs",
        "checkSubmissionFailed"
      ) &&
      window.EngagingNetworks.require._defined.enjs.checkSubmissionFailed()
    ) {
      this.logger.log("Server side error detected");
      this.activateStep("3", true);
    }
  }
}
