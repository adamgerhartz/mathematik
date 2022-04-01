<!-- TEMPLATE -->
<template>
  <router-link to="/addition" class="add-btn">Addition</router-link>
  <router-link to="/subtraction" class="sub-btn">Subtraction</router-link>
  <a class=" mult-btn tooltip" disabled>Multiplication</a>
  <a class="div-btn tooltip" disabled>Division</a>
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

$color-1: #92BDA3; /* Cambridge Blue */
$color-2: #A1BA89; /* Olivine */
$color-3: #A5CC6B; /* Pistachio */
$color-4: #806D40; /* Gold Fusion */
$color-5: #382633; /* Deep Purple */

/* Main SCSS */
button:hover,
a:hover {
  cursor: pointer;
}

.add-btn,
.sub-btn,
.mult-btn,
.div-btn {
  text-align: center;
  background: $color-3;
  border-radius: 2px;
  outline: 3px solid $color-4;
  text-decoration: none;
  color: white;
  padding: 0.5em;
  letter-spacing: 5px;
  transition: color 500ms, background-color 500ms, letter-spacing 500ms;
  font-weight: bold;
}

.add-btn {
  grid-column: 3/8;
  grid-row: 5/6;
}

.sub-btn {
  grid-column: 4/8;
  grid-row: 4/5;
}

.add-btn:hover,
.sub-btn:hover {
  background: $color-1;
  color: $color-5;
  letter-spacing: 7px;
}

.mult-btn {
  grid-column: 5/8;
  grid-row: 3/4;
  opacity: 0.5;
}

.div-btn {
  grid-column: 6/8;
  grid-row: 2/3;
  opacity: 0.5;
}

.mult-btn:hover,
.div-btn:hover {
  cursor: default;
}

/* Credit for this tooltip: https://www.w3schools.com/css/css_tooltip.asp */
.tooltip ~ .tooltiptext {
  opacity: 0;
  grid-column: 7/8;
  grid-row: 1/2;
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 4px;
  z-index: 1;
  transition: opacity 500ms;
}

.tooltip:hover ~ .tooltiptext {
  opacity: 1;
}

/* Media Queries */
@media screen and (max-width: 880px) {
  .tooltip ~ .tooltiptext {
    grid-column: 6/8;
  }
}

@media screen and (max-width: 680px) {
  .tooltip ~ .tooltiptext {
    grid-column: 7/10;
  }

  .div-btn {
    grid-column: 7/10;
  }

  .mult-btn {
    grid-column: 6/10;
  }

  .sub-btn {
    grid-column: 5/10;
  }

  .add-btn {
    grid-column: 4/10;
  }
}
</style>
