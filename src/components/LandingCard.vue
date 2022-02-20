<template>
  <div class="card">
    <h1 class="title">Mathematik 👩‍🏫</h1>
    <p class="phrase">steppin' up in math...</p>
    <button class="add-btn" type="button">Addition</button>
    <button class="sub-btn" type="button">Subtraction</button>
    <button class=" mult-btn tooltip" type="button" disabled>Multiplication</button>
    <button class="div-btn tooltip" type="button" disabled>Division</button>
    <span class="tooltiptext">{{ msg }}</span>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    msg: String
  }
})
export default class LandingCard extends Vue {
  msg!: string
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$container-width: 950px;
.card {
  display: grid;
  margin: auto;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: minmax(25px, auto);
  margin-bottom: 65vh;
  width: $container-width;
  box-shadow: 0 2px 4px #dadce0;
  border: 0.5px solid rgba(0,0,0,0.1);
  background-color: #fff;
  row-gap: 1em;
}

button:hover {
  cursor: pointer;
}

.title {
  grid-column: 1/8;
  grid-row: 1/5;
  margin-left: 20px;
  font-family: fantasy;
}
.phrase {
  grid-column: 1/8;
  grid-row: 1/5;
  margin-left: 55px;
  font-family: Courier;
  margin-top: 60px;
}

.add-btn {
  grid-column: 3/5;
  grid-row: 4/5;
  margin-right: -110%;
  margin-left: 5%;
  margin-top: -0.8em;
}
.sub-btn {
  grid-column: 4/6;
  grid-row: 3/4;
  margin-right: -75%;
  margin-left: 12%;
  margin-top: -0.8em;
}

.div-btn {
  grid-column: 6/8;
  grid-row: 1/2;
}

.mult-btn {
  grid-column: 5/7;
  grid-row: 2/3;
  margin-right: -40%;
  margin-left: 15%;
  margin-top: -0.8em;
}

/* Credit for this tooltip: https://www.w3schools.com/css/css_tooltip.asp */
.tooltip ~ .tooltiptext {
  opacity: 0;
  width: 250px;
  left: 50%;
  margin-top: -75px;
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  transition: opacity 500ms;
}

.tooltip:hover ~ .tooltiptext {
  opacity: 1;
}

@media screen and (max-width: 990px) {
  .card {
    width: 96%;
  }
}

@media screen and (max-width: 680px) {
  .card {
    grid-template-columns: repeat(9, 1fr);
  }
  .title {
    grid-column: 1/10;
    font-size: 1.8em;
    margin-top: 0.8em;
  }
  .phrase {
    grid-column: 1/10;
    font-size: 14px;
    margin-left: 52px;
    margin-top: 57px;
  }
  .div-btn {
    grid-column: 8/10;
  }
  .mult-btn {
    grid-column: 7/9;
  }
  .sub-btn {
    grid-column: 6/8;
  }
  .add-btn {
    grid-column: 5/7;
  }
}
</style>
