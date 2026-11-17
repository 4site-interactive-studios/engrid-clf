// Google Pay logo with black "Pay" text (the original file has white text).
// Used on one-column pages, where the wallet tile is white until it's selected.
const GPAY_LOGO_BLACK_TEXT =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg width="61" height="24" viewBox="0 0 61 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M28.4699 11.6721V18.7481H26.2305V1.27441H32.1672C33.6718 1.27441 34.9548 1.77734 36.0045 2.78319C37.0775 3.78904 37.614 5.01711 37.614 6.4674C37.614 7.95278 37.0775 9.18085 36.0045 10.175C34.9664 11.1691 33.6834 11.6604 32.1672 11.6604H28.4699V11.6721ZM28.4699 3.42646V9.52003H32.2138C33.1003 9.52003 33.8467 9.21593 34.4299 8.61944C35.0247 8.02295 35.328 7.2978 35.328 6.47909C35.328 5.67207 35.0247 4.95863 34.4299 4.36214C33.8467 3.74225 33.1119 3.43816 32.2138 3.43816H28.4699V3.42646Z" fill="black"/><path d="M43.4675 6.39746C45.1238 6.39746 46.4301 6.8419 47.3865 7.73079C48.3429 8.61968 48.8211 9.83606 48.8211 11.3799V18.7483H46.6867V17.0875H46.5934C45.6719 18.4559 44.4356 19.1343 42.896 19.1343C41.5781 19.1343 40.4817 18.7483 39.5953 17.9647C38.7088 17.1811 38.2656 16.2103 38.2656 15.0407C38.2656 13.801 38.7322 12.8185 39.6652 12.0934C40.5983 11.3565 41.8463 10.9939 43.3976 10.9939C44.7272 10.9939 45.8236 11.2396 46.675 11.7308V11.2162C46.675 10.4325 46.3717 9.77757 45.7536 9.22787C45.1354 8.67816 44.4123 8.40915 43.5842 8.40915C42.3362 8.40915 41.3448 8.93547 40.6216 9.9998L38.6505 8.76003C39.7352 7.18108 41.3448 6.39746 43.4675 6.39746ZM40.575 15.0758C40.575 15.6606 40.8199 16.1518 41.3215 16.5378C41.8113 16.9238 42.3945 17.1226 43.0593 17.1226C44.0041 17.1226 44.8438 16.7717 45.5786 16.07C46.3134 15.3682 46.6867 14.5495 46.6867 13.6021C45.9868 13.0524 45.0188 12.7717 43.7708 12.7717C42.861 12.7717 42.1029 12.994 41.4964 13.4267C40.8782 13.8828 40.575 14.4325 40.575 15.0758Z" fill="black"/><path d="M60.9982 6.7832L53.5336 23.9996H51.2242L54.0001 17.9762L49.0781 6.7832H51.5158L55.0615 15.368H55.1081L58.5605 6.7832H60.9982Z" fill="black"/><path d="M19.5617 10.2451C19.5617 9.51294 19.4963 8.81236 19.375 8.13867H9.98828V11.9983L15.3943 11.9995C15.175 13.2837 14.4694 14.3784 13.3882 15.1083V17.6124H16.6061C18.4851 15.8685 19.5617 13.2907 19.5617 10.2451Z" fill="#4285F4"/><path d="M13.3908 15.109C12.495 15.7149 11.3415 16.0693 9.99206 16.0693C7.38527 16.0693 5.17388 14.3079 4.38193 11.9336H1.0625V14.5161C2.70705 17.7886 6.08713 20.0342 9.99206 20.0342C12.691 20.0342 14.9584 19.1441 16.6088 17.612L13.3908 15.109Z" fill="#34A853"/><path d="M4.06939 10.018C4.06939 9.3513 4.18019 8.70686 4.38197 8.10101V5.51855H1.06254C0.38256 6.87177 0 8.39926 0 10.018C0 11.6367 0.383727 13.1642 1.06254 14.5174L4.38197 11.9349C4.18019 11.3291 4.06939 10.6846 4.06939 10.018Z" fill="#FABB05"/><path d="M9.99206 3.96491C11.4652 3.96491 12.7843 4.47368 13.8258 5.46783L16.6776 2.61053C14.9455 0.992983 12.6875 0 9.99206 0C6.08829 0 2.70705 2.24561 1.0625 5.51813L4.38193 8.10058C5.17388 5.72632 7.38527 3.96491 9.99206 3.96491Z" fill="#E94235"/></svg>'
  );

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
      // Multistep pages show the wallet tile in black, so they keep the original
      // logo (white "Pay" text). One-column pages show it on a white tile, so
      // they use the copy with black "Pay" text; clf.scss turns the whole logo
      // white when the tile is selected (red background).
      const isMultistep =
        document.body.hasAttribute("data-engrid-multistep") ||
        document.body.dataset.engridSubtheme === "multistep";
      gPayElement.setAttribute(
        "src",
        isMultistep
          ? "https://acb0a5d73b67fccd4bbe-c2d8138f0ea10a18dd4c43ec3aa4240a.ssl.cf5.rackcdn.com/10054/payment-type-gpay.svg?v=1780423619000"
          : GPAY_LOGO_BLACK_TEXT
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

  // Rename opt-in field labels: Email and Text Message
  if (document.querySelector(".opt-ins")) {
    const emailLabel = document.querySelector(
      "label[for='en__field_supporter_questions_164260']"
    );
    if (emailLabel) {
      emailLabel.textContent = "Email";
    }
    const textMessageLabel = document.querySelector(
      "label[for='en__field_supporter_questions_707325']"
    );
    if (textMessageLabel) {
      textMessageLabel.textContent = "Text Message";
    }
  }

  App.setBodyData("client-js-loading", "finished");
};
