<!-- TEMPLATE -->
<template>
  <router-link to="/addition" class="add-btn">Addition</router-link>
  <router-link to="/subtraction" class="sub-btn">Subtraction</router-link>
  <button class=" mult-btn tooltip" disabled>Multiplication</button>
  <button class="div-btn tooltip" disabled>Division</button>
  <span class="tooltiptext">{{ tooltipText }}</span>
</template>

<!-- SCRIPT -->
<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    tooltipText: String
  },
  emits: {
    'init-practice': ((practiceType: string) => {
      if (practiceType === 'addition' || practiceType === 'subtraction') {
        return true;
      } else {
        console.warn("Unknown practice type...");
        return false;
      }
    })
  },
  methods: {
    initiateAddition() {
      this.$emit('init-practice', 'addition');
    },
    initiateSubtraction() {
      this.$emit('init-practice', 'subtraction');
    }
  },
  created() {
    this.$ls.remove("left");
    this.$ls.remove("right");
  }
})
export default class MainMenu extends Vue {
  tooltipText!: string
}
</script>

<!-- STYLE -->
<style scoped lang="scss">
/* SASS variables */
$container-width: 950px;

/* Main SCSS */
button:hover,
a:hover {
  cursor: pointer;
}

.add-btn {
  appearance: auto;
  writing-mode: horizontal-tb !important;
  text-rendering: auto;
  color: -internal-light-dark(black, white);
  letter-spacing: normal;
  word-spacing: normal;
  line-height: normal;
  text-transform: none;
  text-indent: 0px;
  text-shadow: none;
  display: inline-block;
  text-align: center;
  align-items: flex-start;
  cursor: default;
  box-sizing: border-box;
  background-color: -internal-light-dark(rgb(239, 239, 239), rgb(59, 59, 59));
  margin: 0em;
  padding: 1px 6px;
  border-width: 2px;
  border-style: outset;
  border-color: -internal-light-dark(rgb(118, 118, 118), rgb(133, 133, 133));
  border-image: initial;
  background: #EFEFEF;
  grid-column: 3/5;
  grid-row: 4/5;
  margin-right: -110%;
  margin-left: 5%;
  margin-top: -0.8em;
  border-radius: 2px;
}

.sub-btn {
  background: #EFEFEF;
  border-radius: 2px;
  outline: 1px solid #767676;
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

/* Media Queries */
@media screen and (max-width: 680px) {
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
