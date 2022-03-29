<!-- TEMPLATE -->
<template>
  <div class="hint" v-if="isHint">
    <p class="hint-text" :ref="hint-text"><b>👀 Hint: </b>{{ hint }}</p>
  </div>
  <div
    :style="{ 'grid-template-columns': columnLengthOperand, 'margin-left': dynamicCrunch }"
    class="subtraction-problem">
    <span class="top-bumper-2" :style="{ 'grid-template-columns': answerLength }">
      <li v-for="num in topBumper2" :key="num" :ref="'borrow2' + num.id">
      {{ num }}
      </li>
    </span>
    <span class="top-bumper-1" :style="{ 'grid-template-columns': answerLength }">
      <li @click="borrow(index, false)" v-for="(num, index) in topBumper1" :key="index" :ref="'borrow1' + index"
        :class="{ 'clickable': isHover(index, false) }">
        {{ num }}
      </li>
    </span>
    <span class="left-operand">
      <li
        @click="borrow(index, true)"
        v-for="(num, index) in strArrayLeft"
        :key="index"
        :ref="'lefto' + index"
        :class="{ 'clickable': isHover(index, true) }">
        {{ num }}
      </li>
    </span>
    <span class="operator">-</span>
    <span class="right-operand"><li v-for="num in strArrayRight" :key="num">{{ num }}</li></span>
    <span class="equals-hr"></span>
    <div class="answer"
      :style="{ 'grid-template-columns': answerLength }">
      <li 
        v-for="(uInput, index) in userAnswer"
        @click="moveSequenceOnEdit(index)"
        :key="index">
        <input
          @paste="prevent"
          :ref="'element' + index"
          :class="{ 'visible': isSequence(index), 'clickable': isSequence(index) }"
          @keypress="isNumber($event, index)"
          :disabled="isDisabled(index)"
          @blur="retainValue($event, index)" />
      </li>
    </div>
  </div>
</template>

<!-- SCRIPT -->
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { generateRandomNumber } from '../../../utils/BetterRandomNumberGenerator';
import { precision } from '../../../utils/NumberPrecisionDetector';
import { greatestNumColumn } from '../../../utils/CompareColumnLength';

@Options({
  emits: {
    'user-answer': ((userAnswer: []) => {
      if (userAnswer[userAnswer.length - 1] !== '') {
        return userAnswer;
      }
    }),
    'system-answer': ((systemAnswer: []) => {
      if (systemAnswer) {
        return systemAnswer;
      }
    }),
    'left': ((left: string) => {
      if (left) {
        return left;
      }
    }),
    'right': ((right: string) => {
      if (right) {
        return right;
      }
    }),
    'sequence': ((seq: number) => {
      return seq;
    })
  },
  props: {
    leftO: String,
    rightO: String
  },
  data() {
    return {
      numInitialLeft: 0,
      numInitialRight: 0,
      strGroomedLeft: '',
      strGroomedRight: '',
      numColumnsInOperand: 0,
      numDecimalFractions: 0,
      left: [],
      right: [],
      topBumper1: [],
      topBumper2: [],
      userAnswer: [],
      topBumper1Visibility: [],
      topBumper2Visibility: [],
      currentUserInput: '',
      currentUserInputIndex: 0,
      systemAnswer: [],
      diffAnswerLengthAndOperandLength: 0,
      sequence: 0,
      sequenceCopy: -1,
      borrowMap: new Map(),
      onEdit: false,
      retainedValue: '',
      operandClicked: false,
      borrowClicked: false,
      blurDetected: false,
      isHint: false,
      currentHoverEl: 'Current State',
      counter: 1
    }
  },
  created() {
    this.setup();
  },
  watch: {
    isHintTriggered(value: any) {
      if (value) {
        this.isHint = true;
      } else {
        this.isHint = false;
      }
    }
  },
  computed: {
    hint() {
      for (let i = this.userAnswer.length - 1; i >= this.sequence; i--) {
        if (this.userAnswer[i] === '.') {
          continue;
        }
        if (this.topBumper2[i] !== '' && this.topBumper2Visibility[i]) {
          if (this.userAnswer[i] !== '' && this.userAnswer[i] !== this.systemAnswer[i]) {
            return `${this.topBumper2[i]} - ${this.right[i]} does not equal ${this.userAnswer[i]}`;
          } else if (this.userAnswer[i] === '') {
            return `${this.topBumper2[i]} - ${this.right[i]}`;
          }
        } else if (this.topBumper2[i] !== '' && !this.topBumper2Visibility[i]) {
          if (this.currentHoverEl !== '') {
            const el = eval(`${this.currentHoverEl}`);
            el.style.background = "green";
          }
          return "Highlight";
        } else if (this.topBumper1[i] !== '' && this.topBumper1Visibility[i]) {
          if (this.userAnswer[i] !== '' && this.userAnswer[i] !== this.systemAnswer[i]) {
            return `${this.topBumper1[i]} - ${this.right[i]} does not equal ${this.userAnswer[i]}`;
          } else if (this.userAnswer[i] === '') {
            return `${this.topBumper1[i]} - ${this.right[i]}`;
          }
        } else if (this.topBumper1[i] !== '' && !this.topBumper1Visibility[i]) {
          // highlight hover
          if (this.currentHoverEl !== '') {
            const el = eval(`${this.currentHoverEl}`);
            el.style.background = "green";
          }
          return "Highlight";
        } else {
          if (this.userAnswer[i] !== '' && this.userAnswer[i] !== this.systemAnswer[i]) {
            return `${this.left[i]} - ${this.right[i]} does not equal ${this.userAnswer[i]}`;
          } else if (this.userAnswer[i] === '') {
            return `${this.left[i]} - ${this.right[i]}`;
          }
        }
      }
    },
    strArrayLeft() {
      return this.alignColumns('', this.strGroomedLeft);
    },
    strArrayRight() {
      return this.alignColumns('', this.strGroomedRight);
    },
    dynamicCrunch() {
      switch (this.numColumnsInOperand) {
        case 1:
        case 2:
          return "15vw";
        case 3:
        case 4:
          return "10vw";
        case 5:
        case 6:
        case 7:
          return "5vw";
      }
    },

    columnLengthOperand() {
      // decimal fractions are the numbers to the right of the decimal point => "123.089"
      if (this.numDecimalFractions > 0) {
        if (this.diffAnswerLengthAndOperandLength !== 0) {
          return `repeat(${this.diffAnswerLengthAndOperandLength }, 1fr) repeat(${this.numColumnsInOperand - this.numDecimalFractions - 1}, 1fr) 2vw repeat(${this.numDecimalFractions}, 1fr)`;
        }
        return `repeat(${this.numColumnsInOperand - this.numDecimalFractions - 1}, 1fr) 2vw repeat(${this.numDecimalFractions}, 1fr)`;
      }
      if (this.diffAnswerLengthAndOperandLength  !== 0) {
        return `repeat(${this.diffAnswerLengthAndOperandLength }, 1fr) repeat(${this.numColumnsInOperand}, 1fr)`;
      }
      return `repeat(${this.numColumnsInOperand}, 1fr)`;
    },

    answerLength() {
      if (this.numDecimalFractions > 0) {
        return `repeat(${this.systemAnswer.length - this.numDecimalFractions - 1}, 1fr) 2vw repeat(${this.numDecimalFractions}, 1fr)`;
      }
      return `repeat(${this.systemAnswer.length}, 1fr)`;
    },
  },
  mounted() {
    this.moveSequence(true);
  },
  methods: {
    setup() {
      if (this.leftO === "0" && this.rightO === "0") {
        this.numInitialLeft = generateRandomNumber();
        this.numInitialRight = generateRandomNumber();
      } else {
        this.numInitialLeft = Number(this.leftO);
        this.numInitialRight = Number(this.rightO);
      }
      while (this.numInitialLeft < this.numInitialRight) {
        this.numInitialLeft = generateRandomNumber();
      }
      this.numDecimalFractions = Math.max(precision(this.numInitialLeft), precision(this.numInitialRight));
      this.strGroomedLeft = this.numInitialLeft.toFixed(this.numDecimalFractions);
      this.strGroomedRight = this.numInitialRight.toFixed(this.numDecimalFractions);
      this.$emit("left", this.strGroomedLeft);
      this.$emit("right", this.strGroomedRight);
      this.numColumnsInOperand = greatestNumColumn(this.strGroomedLeft, this.strGroomedRight);
      this.computeMathProblem();
      this.initUserInput();
      this.diffAnswerLengthAndOperandLength = this.systemAnswer.length - this.numColumnsInOperand;
    },

    isHover(index: number, isLeftOperand: boolean) {
      if (index > this.sequence) {
        return;
      }
      // initial state
      if (this.sequenceCopy === -1 && index !== this.left.length - 1) {
        return;
      } else if (this.sequenceCopy === -1 && index === this.left.length - 1) {
        this.sequenceCopy = index;
      }

      let offset = 1;
      while ((this.left[this.sequence - offset] === '.' || this.left[this.sequence - offset] === '0') && !this.topBumper1Visibility[this.sequence - offset]) {
        offset = offset + 1;
      }

      if (index === this.sequence - offset) {
        if (Number(this.left[this.sequence]) < Number(this.right[this.sequence]) && !this.topBumper1Visibility[this.sequence]) {
          if (isLeftOperand) {
            if (this.topBumper1[this.sequence - offset] && !this.topBumper1Visibility[this.sequence - offset]) {
              this.currentHoverEl = `this.$refs.lefto${this.sequence - offset}[0]`;
              return true;
            } else if (this.topBumper1[this.sequence - offset] && this.topBumper1Visibility[this.sequence - offset]) {
              this.currentHoverEl = '';
              return false;
            }
          } else {
            if (this.topBumper2[this.sequence - offset] && this.topBumper1Visibility[this.sequence - offset] && !this.topBumper2Visibility[this.sequence - offset]) {
              this.currentHoverEl = `this.$refs.borrow1${this.sequence - offset}[0]`;
              return true;
            } else if (this.topBumper2[this.sequence - offset] && this.topBumper1Visibility[this.sequence - offset] && this.topBumper2Visibility[this.sequence - offset]) {
              this.currentHoverEl = '';
              return false;
            }
          }
        } else if (Number(this.topBumper1[this.sequence]) < Number(this.right[this.sequence]) && this.topBumper1Visibility[this.sequence]) {
          if (isLeftOperand) {
            if (this.topBumper1[this.sequence - offset] && !this.topBumper1Visibility[this.sequence - offset]) {
              this.currentHoverEl = `this.$refs.lefto${this.sequence - offset}[0]`;
              return true;
            } else if (this.topBumper1[this.sequence - offset] && this.topBumper1Visibility[this.sequence - offset]) {
              this.currentHoverEl = '';
              return false;
            }
          } else {
            if (this.topBumper2[this.sequence - offset] && this.topBumper1Visibility[this.sequence - offset] && !this.topBumper2Visibility[this.sequence - offset]) {
              this.currentHoverEl = `this.$refs.borrow1${this.sequence - offset}[0]`;
              return true;
            } else if (this.topBumper2[this.sequence - offset] && this.topBumper1Visibility[this.sequence - offset] && this.topBumper2Visibility[this.sequence - offset]) {
              this.currentHoverEl = '';
              return false;
            }
          }
        } else {
          this.currentHoverEl = '';
          return false;
        }
      }
    },

    borrow(index: number, isLeftOperand: boolean) {
      console.log(`count == ${this.counter}`);
      this.borrowClicked = false;
      let offset = 1;
      while ((this.left[this.sequenceCopy - offset] === '.' || this.left[this.sequenceCopy - offset] === '0') && !this.topBumper1Visibility[this.sequenceCopy - offset]) {
        offset = offset + 1;
      }
      if (index === this.sequenceCopy - offset) {
        if (this.topBumper1[index] && isLeftOperand && !this.topBumper1Visibility[index]) {
          if (!this.topBumper1Visibility[this.sequenceCopy]) {
            if (Number(this.left[this.sequenceCopy]) < Number(this.right[this.sequenceCopy])) {
              this.borrowClicked = true;
              let el = eval(`this.$refs.lefto${index}[0]`);
              el.style.background = "linear-gradient(to right top, transparent 47.75%, currentColor 49.5%, currentColor 50.5%, transparent 52.25%)";
              el.style.padding = "0 0.15em";
              el = eval(`this.$refs.borrow1${index}[0]`);
              el.style.visibility = 'visible';
              this.topBumper1Visibility[index] = true;
              if (this.left[index + 1] === ".") {
                this.borrowClicked = true;
                let el = eval(`this.$refs.lefto${index + 2}[0]`);
                el.style.background = "linear-gradient(to right top, transparent 47.75%, currentColor 49.5%, currentColor 50.5%, transparent 52.25%)";
                el.style.padding = "0 0.15em";
                el = eval(`this.$refs.borrow1${index + 2}[0]`);
                el.style.visibility = 'visible';
                this.topBumper1Visibility[index + 2] = true;
              } else {
                this.borrowClicked = true;
                let el = eval(`this.$refs.lefto${index + 1}[0]`);
                el.style.background = "linear-gradient(to right top, transparent 47.75%, currentColor 49.5%, currentColor 50.5%, transparent 52.25%)";
                el.style.padding = "0 0.15em";
                el = eval(`this.$refs.borrow1${index + 1}[0]`);
                el.style.visibility = 'visible';
                this.topBumper1Visibility[index + 1] = true;
              }
            }
            this.isHint = false;
          } else {
            if (Number(this.topBumper1[this.sequenceCopy]) < Number(this.right[this.sequenceCopy])) {
              this.borrowClicked = true;
              let el = eval(`this.$refs.lefto${index}[0]`);
              el.style.background = "linear-gradient(to right top, transparent 47.75%, currentColor 49.5%, currentColor 50.5%, transparent 52.25%)";
              el.style.padding = "0 0.15em";
              el = eval(`this.$refs.borrow1${index}[0]`);
              el.style.visibility = 'visible';
              this.topBumper1Visibility[index] = true;
              if (this.left[index + 1] === ".") {
                this.borrowClicked = true;
                let el = eval(`this.$refs.borrow1${index + 2}[0]`);
                el.style.background = "linear-gradient(to right top, transparent 47.75%, currentColor 49.5%, currentColor 50.5%, transparent 52.25%)";
                el.style.padding = "0 0.15em";
                el = eval(`this.$refs.borrow2undefined[${index + 2}]`);
                el.style.visibility = 'visible';
                this.topBumper2Visibility[index + 2] = true;
              } else if (this.left[index + 1] === "0") {
                this.borrowClicked = true;
                let el = eval(`this.$refs.lefto${index + 1}[0]`);
                el.style.background = "linear-gradient(to right top, transparent 47.75%, currentColor 49.5%, currentColor 50.5%, transparent 52.25%)";
                el.style.padding = "0 0.15em";
                el = eval(`this.$refs.borrow1${index + 1}[0]`);
                el.style.visibility = 'visible';
                this.topBumper1Visibility[index + 1] = true;
              } else {
                this.borrowClicked = true;
                let el = eval(`this.$refs.borrow1${index + 1}[0]`);
                el.style.background = "linear-gradient(to right top, transparent 47.75%, currentColor 49.5%, currentColor 50.5%, transparent 52.25%)";
                el.style.padding = "0 0.15em";
                el = eval(`this.$refs.borrow2undefined[${index + 1}]`);
                el.style.visibility = 'visible';
                this.topBumper2Visibility[index + 1] = true;
              }
            }
            this.isHint = false;
          }
        } else if (this.topBumper2[index] && !isLeftOperand && this.topBumper1Visibility[index]) {
          if (!this.topBumper1Visibility[this.sequence]) {
            if (Number(this.left[this.sequenceCopy]) < Number(this.right[this.sequenceCopy])) {
              let el = eval(`this.$refs.borrow1${index}[0]`);
              el.style.background = "linear-gradient(to right top, transparent 47.75%, currentColor 49.5%, currentColor 50.5%, transparent 52.25%)";
              if (el.innerHTML.length === 1) {
                el.style.padding = "0 0.30em";
              }
              el = eval(`this.$refs.borrow2undefined[${index}]`);
              el.style.visibility = 'visible';
              this.topBumper2Visibility[index] = true;
              if (this.left[index + 1] === "." && this.topBumper1Visibility[this.sequenceCopy]) {
                let el = eval(`this.$refs.borrow1${index + 2}[0]`);
                el.style.background = "linear-gradient(to right top, transparent 47.75%, currentColor 49.5%, currentColor 50.5%, transparent 52.25%)";
                if (el.innerHTML.length === 1) {
                  el.style.padding = "0 0.30em";
                }
                el = eval(`this.$refs.borrow2undefined[${index + 2}]`);
                el.style.visibility = 'visible';
                this.topBumper2Visibility[index + 2] = true;
              } else if (this.left[index + 1] === "." && !this.topBumper1Visibility[this.sequenceCopy]) {
                let el = eval(`this.$refs.lefto${index + 2}[0]`);
                el.style.background = "linear-gradient(to right top, transparent 47.75%, currentColor 49.5%, currentColor 50.5%, transparent 52.25%)";
                el.style.padding = "0 0.15em";
                el = eval(`this.$refs.borrow1${index + 2}[0]`);
                el.style.visibility = 'visible';
                this.topBumper1Visibility[index + 2] = true;
              } else if (this.left[index + 1] !== "." && index + 1 !== this.sequenceCopy) {
                if (!this.topBumper1Visibility[index + 1]) {
                  let el = eval(`this.$refs.lefto${index + 1}[0]`);
                  el.style.background = "linear-gradient(to right top, transparent 47.75%, currentColor 49.5%, currentColor 50.5%, transparent 52.25%)";
                  el.style.padding = "0 0.15em";
                  el = eval(`this.$refs.borrow1${index + 1}[0]`);
                  el.style.visibility = 'visible';
                  this.topBumper1Visibility[index + 1] = true;
                } else {
                  let el = eval(`this.$refs.borrow1${index + 1}[0]`);
                  el.style.background = "linear-gradient(to right top, transparent 47.75%, currentColor 49.5%, currentColor 50.5%, transparent 52.25%)";
                  if (el.innnerHTML.length === 1) {
                    el.style.padding = "0 0.30em";
                  }
                  el = eval(`this.$refs.borrow2undefined[${index + 1}]`);
                  el.style.visibility = 'visible';
                  this.topBumper2Visibility[index + 1] = true;
                }
              } else if (index + 1 === this.sequenceCopy) {
                let el = eval(`this.$refs.lefto${index + 1}[0]`);
                el.style.background = "linear-gradient(to right top, transparent 47.75%, currentColor 49.5%, currentColor 50.5%, transparent 52.25%)";
                el.style.padding = "0 0.15em";
                el = eval(`this.$refs.borrow1${index + 1}[0]`);
                el.style.visibility = 'visible';
                this.topBumper1Visibility[index + 1] = true;
              }
            }
            this.isHint = false;
          } else {
            if (Number(this.topBumper1[this.sequenceCopy]) < Number(this.right[this.sequenceCopy])) {
              let el = eval(`this.$refs.borrow1${index}[0]`);
              el.style.background = "linear-gradient(to right top, transparent 47.75%, currentColor 49.5%, currentColor 50.5%, transparent 52.25%)";
              if (el.innerHTML.length === 1) {
                el.style.padding = "0 0.30em";
              }
              el = eval(`this.$refs.borrow2undefined[${index}]`);
              el.style.visibility = 'visible';
              this.topBumper2Visibility[index] = true;
              if (this.topBumper1Visibility[index + 1]) {
                let el = eval(`this.$refs.borrow1${index + 1}[0]`);
                el.style.background = "linear-gradient(to right top, transparent 47.75%, currentColor 49.5%, currentColor 50.5%, transparent 52.25%)";
                if (el.innerHTML.length === 1) {
                  el.style.padding = "0 0.30em";
                }
                el = eval(`this.$refs.borrow2undefined[${index + 1}]`);
                el.style.visibility = 'visible';
                this.topBumper2Visibility[index + 1] = true;
              } else if (this.left[index + 1] === '.') {
                if (this.topBumper1Visibility[index + 2]) {
                  let el = eval(`this.$refs.borrow1${index + 2}[0]`);
                  el.style.background = "linear-gradient(to right top, transparent 47.75%, currentColor 49.5%, currentColor 50.5%, transparent 52.25%)";
                  if (el.innerHTML.length === 1) {
                    el.style.padding = "0 0.30em";
                  }
                  el = eval(`this.$refs.borrow2undefined[${index + 2}]`);
                  el.style.visibility = 'visible';
                  this.topBumper2Visibility[index + 2] = true;
                } else {
                  let el = eval(`this.$refs.lefto${index + 2}[0]`);
                  el.style.background = "linear-gradient(to right top, transparent 47.75%, currentColor 49.5%, currentColor 50.5%, transparent 52.25%)";
                  el.style.padding = "0 0.15em";
                  el = eval(`this.$refs.borrow1${index + 2}[0]`);
                  el.style.visibility = 'visible';
                  this.topBumper1Visibility[index + 2] = true;
                }
              } else {
                let el = eval(`this.$refs.lefto${index + 1}[0]`);
                el.style.background = "linear-gradient(to right top, transparent 47.75%, currentColor 49.5%, currentColor 50.5%, transparent 52.25%)";
                el.style.padding = "0 0.15em";
                el = eval(`this.$refs.borrow1${index + 1}[0]`);
                el.style.visibility = 'visible';
                this.topBumper1Visibility[index + 1] = true;
              }
            }
            this.isHint = false;
          }
        }
      }
    },

    retainValue(event: any, index: number) {
      if (this.sequence === index) {
        const el = eval(`this.$refs.element${this.sequence}[0]`);
        el.value = this.retainedValue;
        el.disabled = true;
        this.userAnswer[this.sequence] = this.retainedValue;
        this.moveSequence(true);
      }
    },

    initUserInput() {
      for (let i = 0; i < this.systemAnswer.length; i++) {
        if (this.systemAnswer[i] !== '.') {
          this.userAnswer.push('');
        } else {
          this.userAnswer.push('.');
        }
      }
    },

    isDisabled(index: number) {
      if (this.sequence !== index) {
        return true;
      }
      return false;
    },

    moveSequence(isOverride: boolean) {
      this.sequenceCopy = this.sequence;
      let index = this.userAnswer.length - 1;
      if (this.onEdit) {
        index = this.sequence;
      }
      while (index !== -1) {
        if (this.userAnswer[index] !== '') {
          index = index - 1;
        } else {
          this.sequence = index;
          break;
        }
      }
      if (this.onEdit || isOverride) {
        if (index !== -1) {
          const el = eval(`this.$refs.element${this.sequence}[0]`);
          el.disabled = false;
          this.retainedValue = el.value;
          el.value = '';
          if (!this.onEdit) {
            el.classList.add("visible");
            el.classList.add("clickable");
          }
          el.focus();
        } else {
          this.sequence = -1;
        }
      }
      this.$emit("sequence", this.sequence);
    },

    moveSequenceOnEdit(index: number) {
      this.isHint = false;
      this.onEdit = true;
      if (this.userAnswer[index] !== '.') {
        const inputCopy = this.userAnswer[index]
        this.userAnswer[index] = '';
        const el = eval(`this.$refs.element${index}[0]`);
        if (el.value === '') {
          return;
        }
        this.sequence = index;
        this.moveSequence(false);
      }
    },

    alignColumns(replacementCharacter: string, str: string) {
      let diff = this.numColumnsInOperand - str.length;
      if (replacementCharacter === '' && this.diffAnswerLengthAndOperandLength !== 0) {
        diff = this.systemAnswer.length - str.length;
      }
      let arr: string[] = [];
      for (let i = 0; i < diff; i++) {
        arr.push(replacementCharacter);
      }
      return arr.concat([...str]);
    },

    computeMathProblem() {
      this.left = this.alignColumns('0', this.strGroomedLeft);
      this.right = this.alignColumns('0', this.strGroomedRight);
      for (const item of this.left) {
        this.topBumper1.push('');
        this.topBumper2.push('');
        (item !== '.') ? this.systemAnswer.push(item) : this.systemAnswer.push('.');
        this.topBumper1Visibility.push(false);
        this.topBumper2Visibility.push(false);
      }

      for (let i = this.numColumnsInOperand - 1; i >= 0; i--) {
        if (this.systemAnswer[i] !== '.') {
          if (Number(this.systemAnswer[i]) < Number(this.right[i])) {
            if (this.systemAnswer[i - 1] === '.' || this.systemAnswer[i - 1] === '0') {
              let pointer = i - 1;
              while (this.systemAnswer[pointer] === '0' || this.systemAnswer[pointer] === '.') {
                pointer = pointer - 1;
              }
              this.borrowMap.set(i, pointer);
              this.systemAnswer[pointer] = (Number(this.systemAnswer[pointer]) - 1).toString();
              if (this.topBumper1[pointer] === '') {
                this.topBumper1[pointer] = this.systemAnswer[pointer];
              } else {
                this.topBumper2[pointer] = this.systemAnswer[pointer];
              }
              while (pointer !== i) {
                pointer = pointer + 1;
                if (pointer !== i) {
                  if (this.systemAnswer[pointer] === '0') {
                    this.systemAnswer[pointer] = (Number(this.systemAnswer[pointer]) + 10).toString();
                    this.topBumper1[pointer] = this.systemAnswer[pointer];
                    this.systemAnswer[pointer] = (Number(this.systemAnswer[pointer]) - 1).toString();
                    this.topBumper2[pointer] = this.systemAnswer[pointer];
                  }
                }
              }
              this.systemAnswer[i] = (Number(this.systemAnswer[i]) + 10).toString();
              if (this.topBumper1[i] === '') {
                this.topBumper1[i] = this.systemAnswer[i];
              } else {
                this.topBumper2[i] = this.systemAnswer[i];
              }
              this.systemAnswer[i] = (Number(this.systemAnswer[i]) - Number(this.right[i])).toString();
            } else {
              this.systemAnswer[i - 1] = (Number(this.systemAnswer[i - 1]) - 1).toString();
              if (this.topBumper1[i - 1] === '') {
                this.topBumper1[i - 1] = this.systemAnswer[i - 1];
              }
              this.systemAnswer[i] = (Number(this.systemAnswer[i]) + 10).toString();
              if (this.topBumper1[i] === '') {
                this.topBumper1[i] = this.systemAnswer[i];
              } else {
                this.topBumper2[i] = this.systemAnswer[i];
              }
              this.systemAnswer[i] = (Number(this.systemAnswer[i]) - Number(this.right[i])).toString();
            }
          } else {
            this.systemAnswer[i] = (Number(this.systemAnswer[i]) - Number(this.right[i])).toString();
          }
        }
      } // end for loop
      this.$emit('system-answer', this.systemAnswer);
      this.sequence = this.systemAnswer.length - 1;
    },

    isNumber(event: any, index: number) {
      this.isHint = false;
      if (event.key === 'Enter' && index === 0) {
        this.userAnswer[index] = '';
        this.onEdit = false;
        this.onEnterOverride = true;
        this.moveSequence();
        return true;
      }
      if ( event.key === '0' ||
           event.key === '1' ||
           event.key === '2' ||
           event.key === '3' ||
           event.key === '4' ||
           event.key === '5' ||
           event.key === '6' ||
           event.key === '7' ||
           event.key === '8' ||
           event.key === '9') {
        if (event.target.value.length === 0) {
          if (this.userAnswer[index - 1] === '.') {
            // just display decimal
            const decimal = eval(`this.$refs.element${(index - 1).toString()}[0]`);
            decimal.classList.add("visible");
            decimal.value = ".";
          }
          // display user input
          const el = eval(`this.$refs.element${index.toString()}[0]`);
          el.value = event.key;
          this.userAnswer[index] = el.value;
          this.onEdit = false;
          this.currentUserInput = this.userAnswer[index];
          this.currentUserInputIndex = index;
          this.moveSequence(true);
          this.$emit('user-answer', this.userAnswer);
          return true;
        } else {
          event.preventDefault();
        }
      } else {
        event.preventDefault();
      }
    },
    prevent(event: any) {
      event.preventDefault();
    },
    isSequence(index: number) {
      if (index == this.systemAnswer.length - 1) {
        return true;
      } else {
        return false;
      }
    },
  }
})
export default class SubtractionComponent extends Vue {
  isTryAgain!: boolean
  leftO!: string
  rightO!: string
  isHintTriggered!: boolean
}
</script>

<!-- STYLE -->
<style scoped lang="scss">
.hint {
  grid-column: 4/7;
  grid-row: 2/3;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto;
  background: tan;
  border-radius: 5px;
  margin: -10px 0 10px 0;
}

.hint-text {
  margin: auto;
  grid-column: 1/5;
  grid-row: 1/2;
  text-align: center;
  font-family: lato;
  letter-spacing: 1.5px;
}

.subtraction-problem {
  grid-column: 4/7;
  grid-row: 2/8;
  margin-top: auto;
  margin-bottom: auto;
  display: grid;
}

.top-bumper-1,
.top-bumper-2 {
  height: 20.63px;
}

.top-bumper-1 li,
.top-bumper-2 li {
  visibility: hidden;
}

.answer li .visible {
  border: none;
  visibility: visible;
  z-index: -1;
  background-color: white;
  cursor: none;
  &:hover {
    cursor: default;
  }
}

.left-operand li.clickable,
.top-bumper-1 li.clickable {
  &:hover {
    cursor: pointer;
    background-color: gainsboro;
  }
}

.answer li .clickable {
  &:hover {
    cursor: pointer;
    background-color: gainsboro;
  }
  &:focus {
    background-color: white;
  }
}

.top-bumper-2 {
  grid-column: 1/12;
  grid-row: 1/3;
  display: grid;
  list-style-type: none;
  li {
    text-align: center;
    margin: auto;
    font-size: large;
  }
}

.top-bumper-1 {
  grid-column: 1/12;
  grid-row: 3/6;
  display: grid;
  list-style-type: none;
  li {
    text-align: center;
    margin: auto;
    font-size: large;
  }
}

.left-operand {
  grid-column: 1/12;
  grid-row: 6/9;
  display: grid;
  grid-template-columns: inherit;
  list-style-type: none;
  li {
    text-align: center;
    margin: auto;
    font-size: xxx-large;
    .clickable:hover {
      cursor: pointer;
      background-color: gainsboro;
    }
  }
}

.operator {
  grid-column: 1/2;
  grid-row: 9/12;
  margin: auto auto auto -1em;
  font-size: xxx-large;
}

.answer {
  li {
    list-style-type: none;
    margin: auto;
    text-align: center;
    input {
      visibility: hidden;
      width: 80%;
      margin: auto;
      font-size: xx-large;
      text-align: center;
    }
    input:hover {
      cursor: pointer;
    }
    input:focus {
      cursor: default;
    }
  }
}

.right-operand {
  grid-column: 1/12;
  grid-row: 9/12;
  display: grid;
  grid-template-columns: inherit;
  list-style-type: none;
  li {
    text-align: center;
    margin: auto;
    font-size: xxx-large;
  }
}

.equals-hr {
  grid-column: 1/12;
  grid-row: 12/11;
  background-color: black;
  height: 3px;
}

.answer {
  grid-column: 1/12;
  grid-row: 12/15;
  height: 50px;
  display: grid;
}
</style>
