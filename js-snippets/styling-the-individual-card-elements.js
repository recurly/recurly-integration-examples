window.recurly.configure("my-public-key");

const elements = window.recurly.Elements();

const cardNumberElement = elements.CardNumberElement({
  style: {
    placeholder: "Number",
    fontColor: "green"
  }
});
const cardMonthElement = elements.CardMonthElement({
  style: {
    placeholder: "Month",
    fontColor: "blue"
  }
});
const cardYearElement = elements.CardYearElement({
  style: {
    placeholder: "Year",
    fontColor: "purple"
  }
});
const cardCvvElement = elements.CardCvvElement({
  style: {
    placeholder: "CVV",
    fontColor: "red"
  }
});

cardNumberElement.attach("#number");
cardMonthElement.attach("#month");
cardYearElement.attach("#year");
cardCvvElement.attach("#cvv");
