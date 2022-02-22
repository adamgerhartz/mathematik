<!-- TEMPLATE -->
<template>
  <button class="add-btn" type="button" @click="initiateAddition">Addition</button>
  <button class="sub-btn" type="button" @click="initiateSubtraction">Subtraction</button>
  <button class=" mult-btn tooltip" type="button" disabled>Multiplication</button>
  <button class="div-btn tooltip" type="button" disabled>Division</button>
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
button:hover {
  cursor: pointer;
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
