function configPaymentMethods() {
  const options = {
    publicKey: window.recurlyConfig.publicKey,
    api: window.recurlyConfig.api,
  }

  const paymentMethodsContainerSelector = "#payment-methods-container";

  const oldContainer = document.querySelector(paymentMethodsContainerSelector);
  const newContainer = oldContainer.cloneNode(false);
  oldContainer.parentElement.replaceChild(newContainer, oldContainer);

  recurly.configure(options);

  if (recurly.AlternativePaymentMethods) {
    const returnURL = new URL(window.location.href)
    returnURL.pathname = returnURL.pathname.replace('index.html', 'completed.html')

    const paymentMethod = recurly.AlternativePaymentMethods({
      allowedPaymentMethods: [
        "boleto", "ideal", "sofort"
      ],
      blockedPaymentMethods: [],
      containerSelector: paymentMethodsContainerSelector,
      amount: 10,
      currency: document.querySelector('#currency').value,
      countryCode: document.querySelector('#country').value,
      locale: "en-US",
      channel: "Web",
      adyen: {
        publicKey: window.adyenConfig.publicKey,
        env: "test",
        showPayButton: false,
        componentConfig: {}
      },
      returnURL: returnURL.toString(),
    });

    paymentMethod.on('error', function (err) {
      console.error(err);
    });

    paymentMethod.on('token', function (token) {
      document.querySelector('[data-recurly=token]').value = token.id;
      const form = document.querySelector('form')

      fetch(form.action, {
        method: form.method,
        body: new FormData(form),
      })
        .then(response => response.json())
        .then(data => {
          console.log({ data })
          if (data.error) {
            alert(data.error);
          } else if (data.action_result) {
            paymentMethod.handleAction(data.action_result)
          }
        })
        .catch(err => {
          console.error(err);
          error(err);
        });
    });

    paymentMethod.on('valid', function (valid) {
      console.log('form valid: ', valid);
    });

    document.querySelector('#payment-methods-pay').addEventListener('click', function () {
      paymentMethod.submit();
    });

    paymentMethod.start();
  }
}

function error(err) {
  document.querySelector('#errors').textContent = 'The following fields appear to be invalid: ' + err.fields.join(', ');
  document.querySelectorAll('button').disabled = false;

  err.fields.forEach(function (field) {
    document.querySelector('[data-recurly=' + field + ']').classList.add('error');
  });
}

window.addEventListener('load', function () {
  const form = document.querySelector('form')
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Reset the errors display
    document.querySelectorAll('input').forEach(input => input.classList.remove('error'));

    // Now we call recurly.token with the form. It goes to Recurly servers
    // to tokenize the credit card information, then injects the token into the
    // data-recurly="token" field above
    //      recurly.token(elements, form, function (err, token) {

    // send any errors to the error function below
    //      if (err) error(err);

    // Otherwise we continue with the form submission
    //    else form.submit();

    //});
  });

  configPaymentMethods();


  document.querySelector('#country').addEventListener('change', function (e) {
    const currencyCountries = {
      NL: 'EUR',
      DE: 'EUR',
      BR: 'BRL',
      GB: 'GBP',
      CH: 'CHF',
      US: 'USD',
    }

    document.querySelector('#currency').value = currencyCountries[e.target.value];
    configPaymentMethods();
  });

  document.querySelector('#currency').addEventListener('change', function () {
    configPaymentMethods();
  });

})
