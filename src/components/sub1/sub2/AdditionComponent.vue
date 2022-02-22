<!-- TEMPLATE -->
<template>
  <div
    :style="{ 'grid-template-columns': columnLength }"
    class="addition-problem"
  >
    <span class="top-bumper"></span>
    <span class="left-operand"></span>
    <span class="operator">+</span>
    <span class="right-operand"></span>
    <span class="equals-hr"></span>
    <div class="answer">
    </div>
  </div>
</template>

<!-- SCRIPT -->
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { generateRandomNumber } from '../../../utils/BetterRandomNumberGenerator';

@Options({
  data() {
    return {
      left: generateRandomNumber(),
      right: generateRandomNumber()
    }
  },
  computed: {
    columnLength() {
      console.log(this.left);
      console.log(this.right);
    }
  },
  methods: {
    hasDecimal(num: number) {
      return num % 1 !== 0;
    }
  }
})
export default class AdditionComponent extends Vue {}
</script>

<!-- STYLE -->
<style scoped lang="scss">
.addition-problem {
  grid-column: 3/8;
  grid-row: 1/8;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: minmax(10px, 14);
}

.top-bumper {
  grid-column: 2/12;
  grid-row: 2/3;
  background-color: black;
}

.left-operand {
  grid-column: 2/12;
  grid-row: 3/6;
  background-color: blue;
}

.operator {
  grid-column: 1/2;
  grid-row: 9/10;
}

.right-operand {
  grid-column: 2/12;
  grid-row: 6/9;
  background-color: grey;
}

.equals-hr {
  grid-column: 2/12;
  grid-row: 9/10;
  background-color: pink;
}

.answer {
  grid-column: 2/12;
  grid-row: 10/13;
  background-color: lime;
}
</style>
