window.recurly.configure("ewr1-f6Ap7rHIVs482EHLK43CQd");

const elements = window.recurly.Elements();

const cardElement = elements.CardElement({
  style: {
    fontColor: "green",
    placeholder: {
      content: {
        number: "Enter your card number"
      }
    }
  }
});

cardElement.attach("#card");

document.querySelector("form").addEventListener("submit", function (event) {
  const form = this;
  event.preventDefault();
  window.recurly.token(elements, form, function (err, token) {
    if (err) {
      // handle error using err.code and err.fields
      console.error(err);
    } else {
      // recurly.js has filled in the 'token' field, so now we can submit the
      // form to your server or send the token to your server as JSON to create a purchase
      console.log({ token });
    }
  });
});
