<!-- TEMPLATE -->
<template>
  <div class="practice-container">
    <nav-menu-component 
      @go-home="goHome"
      @init-submit="initSubmit"
      @refresh="onRefresh"
      @hint="getHint"
      @submit-clicked="onSubmitClicked"
      :isAnswer="isUserAnswer"
    />
    <addition-component
      :key="additionKey"
      @sequence="trackSequence"
      v-if="practiceType === 'addition'"
      @user-answer="getUserAnswer"
      @system-answer="getSystemAnswer"
      @left="getLeft"
      @right="getRight"
      :leftO="isAnotherTry ? leftOperand : '0'"
      :rightO="isAnotherTry ? rightOperand : '0'"
    />
    <subtraction-component 
      :key="subtractionKey"
      v-else
      @sequence="trackSequence"
      @user-answer="getUserAnswer"
      @system-answer="getSystemAnswer"
      @left="getLeft"
      @right="getRight"
      :leftO="isAnotherTry ? leftOperand : '0'"
      :rightO="isAnotherTry ? rightOperand : '0'"
    />
    <submit-component
      :submit="isSubmitClicked"
      :answers="answers"
      @try-again="tryAgain"
      :isTryAgain="isAnotherTry"/>
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
      isSubmitClicked: false,
      isAnotherTry: false,
      additionKey: 0,
      subtractionKey: 0,
      leftOperand: '',
      rightOperand: ''
    }
  },
  computed: {
    isUserAnswer() {
      if (this.userAnswer !== '') {
        return false;
      }
      return true;
    }
  },
  methods: {
    goHome() {
      console.log("Go Home");
    },
    initSubmit() {
      this.isSubmitted = true;
    },
    onRefresh() {
      this.isAnotherTry = false;
      this.refresh();
    },
    refresh() {
      if (!this.isAnotherTry) {
        this.leftOperand = '0';
        this.rightOperand = '0';
      }
      if (this.practiceType === 'subtraction') {
        this.subtractionKey = this.subtractionKey + 1;
        this.additionKey = 0;
      } else if (this.practiceType === 'addition') {
        this.additionKey = this.additionKey + 1;
        this.subtractionKey = 0;
      }
      this.isSubmitClicked = false;
      this.answers = [];
      this.userAnswer = '';
      this.systemAnswer = '';
    },
    getHint() {
      console.log("Get Hint");
    },
    getLeft(left: string) {
      this.leftOperand = left;
    },
    getRight(right: string) {
      this.rightOperand = right;
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
      this.isAnotherTry = false;
      if (this.answers[0] !== '') {
        this.isSubmitClicked = true;
      }
    },
    tryAgain() {
      this.isAnotherTry = true;
      this.refresh();
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
