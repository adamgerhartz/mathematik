<!-- TEMPLATE -->
<template>
  <div class="practice-container">
    <nav-menu-component 
      @go-home="goHome"
      @init-submit="initSubmit"
      @refresh="refresh"
      @hint="getHint"
      @submit-clicked="onSubmitClicked"
      :isAnswer="isUserAnswer"
    />
    <addition-component 
      @sequence="trackSequence"
      v-if="practiceType === 'addition'"/>
    <subtraction-component 
      v-else
      @sequence="trackSequence"
      @user-answer="getUserAnswer"
      @system-answer="getSystemAnswer"
    />
    <submit-component
      :submit="isSubmitClicked"
      :answers="answers"/>
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
      sequence: {},
      userAnswer: '',
      systemAnswer: '',
      answers: [],
      isSubmitClicked: false
    }
  },
  computed: {
    isUserAnswer() {
      console.log(this.userAnswer)
      if (this.userAnswer !== '') {
        return false;
      }
      return true;
    },
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
    },
    getUserAnswer(userAnswer: []) {
      this.userAnswer = '';
      this.isSubmitClicked = false;
      for (let i = userAnswer.length - 1; i >= 0; i--) {
        if (this.userAnswer === '' && userAnswer[i] === '.') {
          return;
        }
        if (userAnswer[i] === '') {
          return;
        }
        this.userAnswer = userAnswer[i] + this.userAnswer;
        this.answers[0] = this.userAnswer;
      }
    },
    getSystemAnswer(systemAnswer: []) {
      for (const item in systemAnswer) {
        this.systemAnswer += systemAnswer[item];
      }
      this.answers[0] = this.userAnswer;
      this.answers[1] = this.systemAnswer;
    },
    onSubmitClicked() {
      console.log("Clicked");
      console.log(this.answers[0])
      console.log(this.userAnswer);
      if (this.answers[0] !== '') {
        this.isSubmitClicked = true;
      }
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
