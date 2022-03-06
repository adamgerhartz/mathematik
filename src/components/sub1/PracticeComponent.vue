<!-- TEMPLATE -->
<template>
  <div class="practice-container">
    <nav-menu-component 
      @go-home="goHome"
      @init-submit="initSubmit"
      @refresh="refresh"
      @hint="getHint"
    />
    <addition-component 
      @sequence="trackSequence"
      v-if="practiceType === 'addition'"/>
    <subtraction-component 
      v-else
      @sequence="trackSequence"
    />
    <submit-component  />
  </div>
</template>

<!-- SCRIPT -->
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import NavMenuComponent from './sub2/NavMenuComponent.vue';
import AdditionComponent from './sub2/AdditionComponent.vue';
import SubtractionComponent from './sub2/SubtractionComponent.vue';
import SubmitComponent from './sub2/SubmitComponent.vue';

@Options({
  components: {
    NavMenuComponent,
    AdditionComponent,
    SubtractionComponent,
    SubmitComponent
  },
  props: {
    practiceType: String,
  },
  data() {
    return {
      isSubmitted: false,
      sequence: {}
    }
  },
  methods: {
    goHome() {
      console.log("Go Home");
    },
    initSubmit() {
      this.isSubmitted = true;
    },
    refresh() {
      this.isSubmitted = false;
    },
    getHint() {
      console.log("Get Hint");
    },
    trackSequence(json: string) {
      this.sequence = json;
    }
  }
})
export default class PracticeComponent extends Vue {
  practiceType!: string
}
</script>

<!-- STYLE -->
<style scoped lang="scss">
/* Main SCSS */
.practice-container {
  grid-column: 1/8;
  grid-row: 1/5;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: minmax(50px, auto);
}

/* Media Queries */
@media screen and (max-width: 680px) {
  .practice-container {
    grid-column: 1/10;
  }
}
</style>
