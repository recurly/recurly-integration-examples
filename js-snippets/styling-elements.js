window.recurly.configure("my-public-key");

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
