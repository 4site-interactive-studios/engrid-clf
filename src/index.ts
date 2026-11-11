import {
  Options,
  App,
  EnForm,
  DonationAmount,
  DonationFrequency,
} from "@4site/engrid-scripts"; // Uses ENGrid via NPM
// import { Options, App } from "../../engrid/packages/scripts"; // Uses ENGrid via Visual Studio Workspace

import "./sass/main.scss";
import { customScript } from "./scripts/main";
import DonationLightboxForm from "./scripts/donation-lightbox-form";
import MultistepForm from "./scripts/multistep-form";

const options: Options = {
  applePay: false,
  UseBodyBannerImageAsBackground: true,
  CapitalizeFields: true,
  ClickToExpand: true,
  CurrencySymbol: "$",
  DecimalSeparator: ".",
  ThousandsSeparator: ",",
  MediaAttribution: true,
  SkipToMainContentLink: true,
  SrcDefer: true,
  ProgressBar: true,
  TidyContact: {
    cid: "24367f68-98c1-46b0-9851-0feddd9bb15d",
    record_field: "supporter.NOT_TAGGED_38",
    date_field: "supporter.NOT_TAGGED_39",
    status_field: "supporter.NOT_TAGGED_40",
    country_fallback: "USA",
    us_zip_divider: "-",
    phone_enable: true,
    phone_preferred_countries: ["us"],
  },
  Debug: App.getUrlParameter("debug") == "true" ? true : false,
  onLoad: () => {
    (<any>window).DonationLightboxForm = DonationLightboxForm;
    new DonationLightboxForm(DonationAmount, DonationFrequency, App);
    new MultistepForm();
    customScript(App, EnForm);
  },
  onResize: () => {},
};
new App(options);
