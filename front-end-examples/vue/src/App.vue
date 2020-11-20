<template>
  <div id="app">
    <section class="price">
      <h1>$10 monthly</h1>
    </section>
    <section>
      <Checkout />
    </section>
  </div>
</template>

<script>
import Checkout from "./components/Checkout";

export default {
  name: "App",
  components: {
    Checkout,
  },
};
</script>

<style>
* {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -ms-box-sizing: border-box;
  -o-box-sizing: border-box;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  background: -webkit-linear-gradient(-30deg, #e1e3e6, #ebeff8);
  background: -moz-linear-gradient(-30deg, #e1e3e6, #ebeff8);
  background: -ms-linear-gradient(-30deg, #e1e3e6, #ebeff8);
  background: -o-linear-gradient(-30deg, #e1e3e6, #ebeff8);
  background: linear-gradient(-30deg, #e1e3e6, #ebeff8);
  font-family: "Open Sans", Helvetica, sans-serif;
  text-align: center;
}

section {
  margin: 0 auto 1em;
  max-width: 16rem;
}

section:first-child {
  overflow: auto;
}

label,
.label {
  display: block;
  text-align: left;
  width: 100%;
  margin: 0 0 0.2rem;
  color: #2c0730;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
  clear: left;
}

input[type="text"],
select {
  position: relative;
  width: 100%;
  border: 2px solid #c2c2c2;
  background: transparent;
  padding: 0.5rem;
  margin: 0 0 1rem;
  outline: none;
  font-family: "Open Sans", Helvetica, sans-serif;
  font-size: 1rem;
  font-weight: bold;
  box-shadow: none;
  border-radius: 0;
  color: #c2c2c2;
  -webkit-appearance: none;
  -webkit-transition: border-color 0.3s;
  -moz-transition: border-color 0.3s;
  -ms-transition: border-color 0.3s;
  -o-transition: border-color 0.3s;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #2c0730;
  color: #2c0730;
  z-index: 10;
}

input.error {
  border-color: #e43c29;
}

div.recurly-element-invalid {
  border: 2px solid #e43c29;
}

div.date {
  display: inline-block;
  width: 4.5rem;
  float: left;
  text-align: left;
  margin-right: -2px;
}

div.date label {
  display: inline-block;
  clear: none;
}

div.date input {
  display: inline-block;
}

button {
  border: none;
  width: 100%;
  background: #2c0730;
  outline: none;
  padding: 1rem;
  font-family: "Open Sans", Helvetica, sans-serif;
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 0.15rem;
  color: #f5f5f5;
  cursor: pointer;
  -webkit-transition-timing-function: cubic-bezier(0.7, 0, 0.3, 1);
  -moz-transition-timing-function: cubic-bezier(0.7, 0, 0.3, 1);
  -ms-transition-timing-function: cubic-bezier(0.7, 0, 0.3, 1);
  -o-transition-timing-function: cubic-bezier(0.7, 0, 0.3, 1);
  transition-timing-function: cubic-bezier(0.7, 0, 0.3, 1);
  -webkit-transition: opacity 0.3s;
  -moz-transition: opacity 0.3s;
  -ms-transition: opacity 0.3s;
  -o-transition: opacity 0.3s;
  transition: opacity 0.3s;
}

button:disabled {
  opacity: 0.6;
}

.recurly-element {
  position: relative;
  width: 100%;
  height: 42px;
  border: 2px solid #c2c2c2;
  background: transparent;
  margin: 0 0 1rem;
  outline: none;
  font-family: "Open Sans", Helvetica, sans-serif;
  font-size: 1rem;
  font-weight: bold;
  box-shadow: none;
  border-radius: 0;
  color: #c2c2c2;
  -webkit-appearance: none;
  -webkit-transition: border-color 0.3s;
  -moz-transition: border-color 0.3s;
  -ms-transition: border-color 0.3s;
  -o-transition: border-color 0.3s;
  transition: border-color 0.3s;
}

.recurly-element-focus {
  border-color: #2c0730;
  color: #2c0730;
  z-index: 10;
}
</style>
