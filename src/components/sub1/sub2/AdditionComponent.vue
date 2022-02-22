<!-- TEMPLATE -->
<template>
  <div class="addition-problem">
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

@Options({
})
export default class AdditionComponent extends Vue {}
</script>

<!-- STYLE -->
<style scoped lang="scss">
.addition-problem {
  grid-column: 3/8;
  grid-row: 1/8;
}
</style>
