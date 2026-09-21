export const customScript = function (App, EnForm) {
  console.log("ENGrid client scripts are executing");
  // Add your client scripts here
  const giveBySelectWrapper = document.querySelector(".give-by-select-wrapper");
  if (giveBySelectWrapper) {
    // Find apple-pay class, set data-src to the apple pay image, and add the class "apple-pay-image"
    const applePayElement = giveBySelectWrapper.querySelector("img.apple-pay");
    if (applePayElement) {
      applePayElement.setAttribute(
        "src",
        "https://acb0a5d73b67fccd4bbe-c2d8138f0ea10a18dd4c43ec3aa4240a.ssl.cf5.rackcdn.com/10054/payment-type-applepay.svg?v=1780423619000"
      );
    }
    const gPayElement = giveBySelectWrapper.querySelector("img.google-pay");
    if (gPayElement) {
      gPayElement.setAttribute(
        "src",
        "https://acb0a5d73b67fccd4bbe-c2d8138f0ea10a18dd4c43ec3aa4240a.ssl.cf5.rackcdn.com/10054/payment-type-gpay.svg?v=1780423619000"
      );
    }
    const payPalWhiteElement =
      giveBySelectWrapper.querySelectorAll("img.paypal-w");
    for (const element of payPalWhiteElement) {
      element.setAttribute(
        "src",
        "https://acb0a5d73b67fccd4bbe-c2d8138f0ea10a18dd4c43ec3aa4240a.ssl.cf5.rackcdn.com/10054/payment-type-paypal-w.svg?v=1780423619000"
      );
    }
    const payPalBlackElement =
      giveBySelectWrapper.querySelectorAll("img.paypal-b");
    for (const element of payPalBlackElement) {
      element.setAttribute(
        "src",
        "https://acb0a5d73b67fccd4bbe-c2d8138f0ea10a18dd4c43ec3aa4240a.ssl.cf5.rackcdn.com/10054/payment-type-paypal-b.svg?v=1780423619000"
      );
    }
    const dafPayElement = giveBySelectWrapper.querySelector("img.daf");
    if (dafPayElement) {
      dafPayElement.setAttribute(
        "src",
        "https://acb0a5d73b67fccd4bbe-c2d8138f0ea10a18dd4c43ec3aa4240a.ssl.cf5.rackcdn.com/10054/payment-type-daf.svg?v=1780423619000"
      );
    }
    const bankElement = giveBySelectWrapper.querySelector("img.bank");
    if (bankElement) {
      bankElement.setAttribute(
        "src",
        "https://aaf18515da0e792f78-c27fdabe952dfc357fe25ebf5c8897ee.ssl.cf5.rackcdn.com/2184/payment-type-bank.svg?v=1780423619000"
      );
    }
    const venmoElement = giveBySelectWrapper.querySelector("img.venmo");
    if (venmoElement) {
      venmoElement.setAttribute(
        "src",
        "https://acb0a5d73b67fccd4bbe-c2d8138f0ea10a18dd4c43ec3aa4240a.ssl.cf5.rackcdn.com/10054/payment-type-venmo.svg?v=1780423619000"
      );
    }
    const cardsElement = giveBySelectWrapper.querySelector(
      "img.credit-card-logos"
    );
    if (cardsElement) {
      cardsElement.setAttribute(
        "src",
        "https://acb0a5d73b67fccd4bbe-c2d8138f0ea10a18dd4c43ec3aa4240a.ssl.cf5.rackcdn.com/10054/payment-type-cards.png?v=1780423619000"
      );
    }
  }
  App.setBodyData("client-js-loading", "finished");
};
