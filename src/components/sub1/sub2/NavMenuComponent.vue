<!-- TEMPLATE -->
<template>
  <div class="nav">
    <button type="button" @click="goHome">Home</button>
    <button type="button">Refresh</button>
    <button type="button">Hint</button>
    <button type="button" disabled>Submit</button>
  </div>
</template>

<!-- SCRIPT -->
<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  emits: ['go-home'],
  methods: {
    goHome() {
      this.$emit('go-home');
    }
  }
})
export default class NavMenuComponent extends Vue {}
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

button {
  width: 150px;
  margin: auto auto auto 20px;
  height: 40px;
}

/* Media Queries */
@media screen and (max-width: 680px) {
  button {
    width: 130px;
    height: 34.67px;
  }
}
</style>
