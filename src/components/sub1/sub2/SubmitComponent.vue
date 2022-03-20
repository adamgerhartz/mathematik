<!-- TEMPLATE -->
<template>
  <div class="submit">
    <div class="submit-container green" v-if="submit && correct">
      <p class="correct">Correct! 👍</p>
    </div>
    <div class="submit-container red" v-else-if="submit && !correct">
      <p class="incorrect">Incorrect!</p>
      <button class="try-again">Try Again</button>
    </div>
  </div>
</template>

<!-- SCRIPT -->
<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    answers: {
      type: Array,
      default: []
    },
    submit: Boolean
  },
  computed: {
    correct() {
      if (Number(this.answers[0]) === Number(this.answers[1])) {
        return true;
      } else {
        return false;
      }
    }
  }
})
export default class SubmitComponent extends Vue {
  answers!: string[]
  submit!: boolean
}
</script>

<!-- STYLE -->
<style scoped lang="scss">
.submit {
  grid-column: 3/8;
  grid-row: 8/10;
  padding: 1em;
}

.submit-container {
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: repeat(3, 1fr);
  height: 100%;
  border-radius: 5px;
}

.green {
  background-color: #7dc734;
}

.red {
  background-color: #eb4359;
  
}

.correct {
  margin: auto;
  grid-column: 1/4;
  grid-row: 1/4;
}

.incorrect {
  margin: auto;
  grid-column: 1/3;
  grid-row: 1/4;
}

.try-again {
  margin: auto;
  grid-column: 2/4;
  grid-row: 1/4;
}
</style>
