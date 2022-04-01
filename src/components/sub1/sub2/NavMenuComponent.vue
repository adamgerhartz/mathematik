<!-- TEMPLATE -->
<template>
  <div class="nav">
    <router-link class="home" @click="home" to="/">Home</router-link>
    <a @click="refresh">New Problem</a>
    <button id="hint" :disabled="onSequence" @click="sendHint">Hint</button>
    <button id="submit" :disabled="isAnswer" @click="triggerSubmissionComponent">Submit</button>
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
$color-1: #92BDA3; /* Cambridge Blue */
$color-2: #A1BA89; /* Olivine */
$color-3: #A5CC6B; /* Pistachio */
$color-4: #806D40; /* Gold Fusion */
$color-5: #382633; /* Deep Purple */

a:hover,
#submit:hover,
#hint:hover {
  cursor: pointer;
  background: $color-1;
  color: $color-5;
  letter-spacing: 7px;
}

a,
#submit,
#hint {
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

.nav {
  grid-column: 1/3;
  grid-row: 4/8;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: repeat(4, 1fr);
}

a,
#submit,
#hint {
  width: 200px;
  margin: auto auto auto 20px;
  height: 40px;
}

#submit,
#hint {
  border: none;
}

#submit:disabled,
#hint:disabled {
  opacity: 0.5;
  cursor: default;
  background: $color-3;
  color: white;
  letter-spacing: 5px;
}

/* Media Queries */
@media screen and (max-width: 680px) {
  a,
  a {
    width: 130px;
    height: 34.67px;
  }
}
</style>
