<!-- TEMPLATE -->
<template>
  <div class="nav">
    <router-link class="home" @click="home" to="/">Home</router-link>
    <button type="button" @click="refresh">New Problem</button>
    <button type="button" :disabled="onSequence" @click="sendHint">Hint</button>
    <button type="button" :disabled="isAnswer" @click="triggerSubmissionComponent">Submit</button>
  </div>
</template>

<!-- SCRIPT -->
<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  emits: [
    'go-home',
    'submit-clicked',
    'refresh',
    'on-hint-triggered'
  ],
  methods: {
    home() {
      this.$ls.remove("left");
      this.$ls.remove("right");
    },
    triggerSubmissionComponent() {
      this.$emit('submit-clicked');
    },
    refresh() {
      this.$ls.remove("left");
      this.$ls.remove("right");
      this.$emit('refresh');
    },
    sendHint() {
      this.$emit('on-hint-triggered');
    }
  },
  props: {
    isAnswer: Boolean,
    onSequence: Boolean
  },
})
export default class NavMenuComponent extends Vue {
  isAnswer!: boolean
  onSequence!: boolean
}
</script>

<!-- STYLE -->
<style scoped lang="scss">
.nav {
  grid-column: 1/3;
  grid-row: 4/8;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: repeat(4, 1fr);
}

button,
a {
  width: 150px;
  margin: auto auto auto 20px;
  height: 40px;
}

/* Media Queries */
@media screen and (max-width: 680px) {
  button,
  a {
    width: 130px;
    height: 34.67px;
  }
}
</style>
