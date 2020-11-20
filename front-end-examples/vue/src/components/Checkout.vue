<template>
  <div>
    <form @submit.prevent="submit" ref="form">
      <div ref="card-element" class="card-element"></div>
      <div>
        <label for="first_name">First Name</label>
        <input
          type="text"
          data-recurly="first_name"
          id="first_name"
          name="first-name"
        />
      </div>

      <div>
        <label for="last_name">Last Name</label>
        <input
          type="text"
          data-recurly="last_name"
          id="last_name"
          name="last-name"
        />
      </div>
      <button>Subscribe</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "Checkout",
  mounted: function () {
    // Set this to your public key
    window.recurly.configure("my-public-key");
    this.elements = window.recurly.Elements();
    this.cardElement = this.elements.CardElement();
    this.cardElement.attach(this.$refs["card-element"]);
  },
  methods: {
    submit() {
      window.recurly.token(this.elements, this.$refs.form, function (
        err,
        token
      ) {
        if (err) {
          console.log(err);
          // handle error using err.code and err.fields
        } else {
          console.log({ token });
          // recurly.js has filled in the 'token' field, so now we can submit the
          // form to your server
          // this.$refs.submit();
        }
      });
    },
  },
};
</script>

<style scoped>
</style>
