<!-- TEMPLATE -->
<template>
  <div class="main-widget">
    <h1 class="title">Mathematik 👩‍🏫</h1>
    <p class="subtitle">steppin' up in math...</p>
    <main-menu-component
      tooltipText="Coming soon..."
      v-if="practiceType === 'N/A'"
      @init-practice="initPractice"
    />
    <practice-component v-else
      :practiceType="practiceType"
      @goHome="goHome"
    />
  </div>
</template>

<!-- SCRIPT -->
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import MainMenuComponent from './sub1/MainMenuComponent.vue';
import PracticeComponent from './sub1/PracticeComponent.vue';

@Options({
  props: {
    practiceType: String
  },
  components: {
    MainMenuComponent,
    PracticeComponent
  },
})
export default class MainWidget extends Vue {
  practiceType!: string
}
</script>

<!-- STYLE -->
<style scoped lang="scss">
/* SASS variables */
$widget-width: 950px;
$dynamic-width: 96%;

/* Main SCSS */
.main-widget {
  padding: 0.5em;
  display: grid;
  margin: auto;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: minmax(25px, auto);
  margin-top: 15vh;
  width: $widget-width;
  box-shadow: 0 2px 4px #dadce0;
  border: 0.5px solid rgba(0,0,0,0.1);
  background-color: #fff;
  row-gap: 1em;
}

.title {
  grid-column: 1/8;
  grid-row: 1/5;
  margin-left: 20px;
  font-family: fantasy;
}

.subtitle {
  grid-column: 1/8;
  grid-row: 1/5;
  margin-left: 55px;
  font-family: Courier;
  margin-top: 60px;
}

/* Media Queries */
@media screen and (max-width: 990px) {
  .main-widget {
    width: $dynamic-width;
  }
}

@media screen and (max-width: 680px) {
  .main-widget {
    grid-template-columns: repeat(9, 1fr);
  }

  .title {
    grid-column: 1/10;
    font-size: 1.8em;
    margin-top: 0.8em;
  }

  .subtitle {
    grid-column: 1/10;
    font-size: 14px;
    margin-left: 52px;
    margin-top: 57px;
  }
}
</style>
