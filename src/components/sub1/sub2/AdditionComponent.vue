<!-- TEMPLATE -->
<template>
  <div class="hint" v-if="isHint">
    <p class="hint-text" ref="hint-text"><b>👀 Hint: </b>{{ hint }}</p>
  </div>
  <div
    :style="{ 'grid-template-columns': columnLengthOperand, 'margin-left': dynamicCrunch }"
    class="addition-problem">
    <span class="top-bumper" :style="{ 'grid-template-columns': answerLength }">
      <li v-for="num in topBumper" :key="num" :ref="'carry' + num.id">
        {{ num }}
      </li>
    </span>
    <span class="left-operand"><li v-for="num in strArrayLeft" :key="num">{{ num }}</li></span>
    <span class="operator">+</span>
    <span class="right-operand"><li v-for="num in strArrayRight" :key="num">{{ num }}</li></span>
    <span class="equals-hr"></span>
    <div class="answer"
      :style="{ 'grid-template-columns': answerLength }">
      <li 
        v-for="(uInput, index) in userInput"
        @click="moveSequenceOnEdit(index)"
        :key="index">
        <input
          @paste="prevent"
          :ref="'element' + index"
          :class="{ 'visible': isSequence(index), 'clickable': isSequence(index) }"
          @keypress="isNumber($event, index)"
          :autofocus="sequence === index"
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
    'rare-new-problem': (() => {
      return true;
    }),
    'sequence': ((seq: number) => {
      return seq;
    })
  },
  props: {
    leftO: String,
    rightO: String
  },
  mounted() {
    this.moveSequence(true);
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
      topBumper: [],
      userInput: [],
      currentUserInput: '',
      currentUserInputIndex: 0,
      answer: [],
      diffAnswerLengthAndOperandLength: 0,
      sequence: 0,
      copySequence: 0,
      onEdit: false,
      retainedValue: '',
      isHint: false
    }
  },
  created() {
    this.setup();
  },
  computed: {
    hint() {
      console.log("Called");
      for (let i = this.userInput.length - 1; i >= this.sequence; i--) {
        if (this.userInput[i] === '.') {
          continue;
        }
        if (this.userInput[i] !== '') {
          if (this.userInput[i] !== this.answer[i]) {
            if (this.topBumper[i]) {
              return `${this.topBumper[i]} + ${this.left[i]} + ${this.right[i]} does not equal ${this.userInput[i]}`
            } else {
              return `${this.left[i]} + ${this.right[i]} does not equal ${this.userInput[i]}`
            }
          }
        } else {
          if (this.topBumper[i]) {
            return `${this.topBumper[i]} + ${this.left[i]} + ${this.right[i]}`;
          } else {
            return `${this.left[i]} + ${this.right[i]}`;
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
        return `repeat(${this.answer.length - this.numDecimalFractions - 1}, 1fr) 2vw repeat(${this.numDecimalFractions}, 1fr)`;
      }
      return `repeat(${this.answer.length}, 1fr)`;
    },
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
      while (this.numInitialLeft.toString().length === "1" || this.numInitialRight.toString().length === "1") {
        this.numInitialLeft = generateRandomNumber();
        this.numInitialRight = generateRandomNumber();
      }
      if (this.$ls.get('left')) {
        this.numInitialLeft = this.$ls.get('left');
        this.numInitialRight = this.$ls.get('right');
      }
      this.$ls.set('left', this.numInitialLeft);
      this.$ls.set('right', this.numInitialRight);
      this.numDecimalFractions = Math.max(precision(this.numInitialLeft), precision(this.numInitialRight));
      this.strGroomedLeft = this.numInitialLeft.toFixed(this.numDecimalFractions);
      this.strGroomedRight = this.numInitialRight.toFixed(this.numDecimalFractions);
      this.$emit("left", this.strGroomedLeft);
      this.$emit("right", this.strGroomedRight);
      this.numColumnsInOperand = greatestNumColumn(this.strGroomedLeft, this.strGroomedRight);
      this.computeMathProblem();
      this.initUserInput();
      this.diffAnswerLengthAndOperandLength = this.answer.length - this.numColumnsInOperand;
    },

    autoCarry() {
      if (this.userInput[this.sequence - 1]) {
        if (this.topBumper[this.sequence - 2]) {
          if (this.userInput[this.sequence - 1] === '.' && this.topBumper[this.sequence - 2] === '1') {
            const el = eval(`this.$refs.carryundefined[${this.sequence - 2}]`);
            if (this.currentUserInput === this.answer[this.currentUserInputIndex]) {
              el.style.visibility = "visible";
            } else {
              el.style.visibility = "hidden";
            }
          }
        }
      }
      if (this.topBumper[this.sequence - 1]) {
        if (this.topBumper[this.sequence - 1] === '1') {
          const el = eval(`this.$refs.carryundefined[${this.sequence - 1}]`);
          if (this.currentUserInput === this.answer[this.currentUserInputIndex]) {
            el.style.visibility = "visible";
          } else {
            el.style.visibility = "hidden";
          }
        }
      }
    },

    retainValue(event: any, index: number) {
      let isFull = true;
      for (let i = 0; i < this.userInput.length; i++) {
        if (this.userInput[i] === '') {
          isFull = false;
        }
      }
      if (this.onEdit && isFull) {
        const el = eval(`this.$refs.element${this.sequence}[0]`);
        el.value = this.retainedValue;
        el.disabled = true;
        this.userInput[this.sequence] = this.retainedValue;
      } else {
        if (this.sequence === index) {
          const el = eval(`this.$refs.element${this.sequence}[0]`);
          el.value = this.retainedValue;
          el.disabled = true;
          this.userInput[this.sequence] = this.retainedValue;
          this.moveSequence(true);
        }
      }
    },

    initUserInput() {
      for (let i = 0; i < this.answer.length; i++) {
        if (this.answer[i] !== '.') {
          this.userInput.push('');
        } else {
          this.userInput.push('.');
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
      let index = this.userInput.length - 1;
      if (this.onEdit) {
        index = this.sequence;
      }
      while (index !== -1) {
        if (this.userInput[index] !== '') {
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
      this.isHint = false;
    },

    moveSequenceOnEdit(index: number) {
      this.isHint = false;
      this.onEdit = true;
      if (this.userInput[index] !== '.') {
        this.userInput[index] = '';
        const el = eval(`this.$refs.element${index}[0]`);
        if (el.value === '') {
          // handles edge-case: button smash or double click
          return;
        }
        this.sequence = index;
        this.moveSequence(false);
      }
    },

    alignColumns(replacementCharacter: string, str: string) {
      let diff = this.numColumnsInOperand - str.length;
      if (replacementCharacter === '' && this.diffAnswerLengthAndOperandLength !== 0) {
        diff = this.answer.length - str.length;
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
        (item !== '.') ? this.topBumper.push('') : this.topBumper.push('.');
        (item !== '.') ? this.answer.push('0') : this.answer.push('.');
      }

      for (let i = this.numColumnsInOperand - 1; i >= 0; i--) {
        // use left[i] only because the decimal points are already aligned properly
        if (this.left[i] !== '.') {
          const answer = (Number(this.left[i]) + Number(this.right[i]) + Number(this.answer[i])).toString();
          // carry over logic
          if (answer.length === 2) {
            const twoDigitNumber = Array.from(answer);
            this.answer[i] = twoDigitNumber[1];
            if (this.answer[i - 1] && this.answer[i - 1] === '.') {
              // we don't need to null check on this.answer[i - 2], there will always be a number to the left of the decimal
              this.answer[i - 2] = twoDigitNumber[0];
              this.topBumper[i - 2] = twoDigitNumber[0];
            } else if (this.answer[i - 1]) {
              this.answer[i - 1] = twoDigitNumber[0];
              this.topBumper[i - 1] = twoDigitNumber[0];
            } else {
              this.answer.unshift(twoDigitNumber[0]);
              this.topBumper.unshift(twoDigitNumber[0]);
            }
          } else {
            this.answer[i] = answer;
          }
        }
      } // end for loop

      // edge case: remove additional carry-over
      if (this.topBumper[0] && this.topBumper.length > this.left.length && this.topBumper.length > this.right.length) {
        this.$ls.remove("left");
        this.$ls.remove("right");
        this.$emit("rare-new-problem");
        return;
      }

      this.$emit('system-answer', this.answer);
      this.sequence = this.answer.length - 1;
    },

    isNumber(event: any, index: number) {
      this.isHint = false;
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
          if (this.userInput[index - 1] === '.') {
            // just display decimal
            const decimal = eval(`this.$refs.element${(index - 1).toString()}[0]`);
            decimal.classList.add("visible");
            decimal.value = ".";
          }
          // display user input
          const el = eval(`this.$refs.element${index.toString()}[0]`);
          el.value = event.key;
          this.userInput[index] = el.value;
          this.onEdit = false;
          this.currentUserInput = this.userInput[index];
          this.currentUserInputIndex = index;
          this.autoCarry();
          this.$emit('user-answer', this.userInput);
          this.moveSequence(true);
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
      if (index == this.answer.length - 1) {
        return true;
      } else {
        return false;
      }
    },
  }
})
export default class AdditionComponent extends Vue {
  leftO!: string
  rightO!: string
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
}

.hint-text {
  margin: auto;
  grid-column: 1/5;
  grid-row: 1/2;
  text-align: center;
  font-family: lato;
  letter-spacing: 1.5px;
}

.addition-problem {
  grid-column: 4/7;
  grid-row: 2/8;
  margin-top: auto;
  margin-bottom: auto;
  display: grid;
}

.top-bumper {
  height: 20.63px;
}

.top-bumper li {
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

.answer li .clickable {
  &:hover {
    cursor: pointer;
    background-color: gainsboro;
  }
  &:focus {
    background-color: white;
  }
}

.top-bumper {
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

.left-operand {
  grid-column: 1/12;
  grid-row: 3/6;
  display: grid;
  grid-template-columns: inherit;
  list-style-type: none;
  li {
    text-align: center;
    margin: auto;
    font-size: xxx-large;
  }
}

.operator {
  grid-column: 1/2;
  grid-row: 6/9;
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
  grid-row: 6/9;
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
  grid-row: 9/10;
  background-color: black;
  height: 3px;
}

.answer {
  grid-column: 1/12;
  grid-row: 10/13;
  height: 50px;
  display: grid;
}
</style>
