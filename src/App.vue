<template>
  <div class="page">
    <LandingCard msg="Nope... Working on this now; should be ready next release" />
    <CustomFooter year="2022" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import LandingCard from './components/LandingCard.vue';
import CustomFooter from './components/CustomFooter.vue';

@Options({
  components: {
    LandingCard,
    CustomFooter
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

.page {
  width: 100%;
  height: 100vh;
  margin: auto;
  display: flex;
  align-items: center;
  background-color: #F8F9FA;
  flex-direction: column;
}
</style>
