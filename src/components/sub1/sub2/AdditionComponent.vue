<!-- TEMPLATE -->
<template>
  <div
    :style="{ 'grid-template-columns': columnLengthOperand, 'margin-left': dynamicCrunch }"
    class="addition-problem">
    <span class="top-bumper" :style="{ 'grid-template-columns': answerLength }">
      <li
        v-for="num in carryArr"
        :key="num"
        :style="{ 'visibility': isAutoCarry() }">
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
          :disabled="isDisabled(index, uInput)"
          @blur="retainValue(index)" />
      </li>
     <!-- <input
        v-for="(num, index) in answer" :key="index"
        @paste="prevent"
        :ref="'element' + num.id"
        v-model="userInput[index]"
        :disabled="index > sequence || num === '.'"
        :autofocus="sequence === index"
        :style="{ 'visibility': isSequence(index) }"
        @keypress="isNumber($event)" /> -->
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
  data() {
    return {
      numInitialLeft: generateRandomNumber(),
      numInitialRight: generateRandomNumber(),
      strGroomedLeft: '',
      strGroomedRight: '',
      numColumnsOperand: 0,
      numDecimalFractions: 0,
      leftArray: [],
      rightArray: [],
      carryArr: [],
      userInput: [],
      answer: [],
      diffAnswerLengthAndOperandLength: 0,
      sequence: 0,
      copySequence: 0,
      onEdit: false,
      retainedValue: ''
    }
  },
  created() {
    this.setup();
  },
  computed: {
    strArrayLeft() {
      return this.alignColumns('', this.strGroomedLeft);
    },
    strArrayRight() {
      return this.alignColumns('', this.strGroomedRight);
    },
    dynamicCrunch() {
      switch (this.numColumnsOperand) {
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
          return `repeat(${this.diffAnswerLengthAndOperandLength }, 1fr) repeat(${this.numColumnsOperand - this.numDecimalFractions - 1}, 1fr) 2vw repeat(${this.numDecimalFractions}, 1fr)`;
        }
        return `repeat(${this.numColumnsOperand - this.numDecimalFractions - 1}, 1fr) 2vw repeat(${this.numDecimalFractions}, 1fr)`;
      }
      if (this.diffAnswerLengthAndOperandLength  !== 0) {
        return `repeat(${this.diffAnswerLengthAndOperandLength }, 1fr) repeat(${this.numColumnsOperand}, 1fr)`;
      }
      return `repeat(${this.numColumnsOperand}, 1fr)`;
    },
    answerLength() {
      if (this.numDecimalFractions > 0) {
        return `repeat(${this.answer.length - this.numDecimalFractions - 1}, 1fr) 2vw repeat(${this.numDecimalFractions}, 1fr)`;
      }
      return `repeat(${this.answer.length}, 1fr)`;
    },
  },
  watch: {
    sequence(value: number) {
      /*if (this.onEdit && this.userInput[value] == '') {
        this.userInput[value] = '5';
      }*/
      /*if (!this.onEdit || this.sequence != -1) {
        if (value === -1) {
          return;
        }
        if (value !== this.answer.length - 1) {
          const el = eval(`this.$refs.element${value.toString()}[0]`);
          el.classList.add("visible");
          el.focus();
          if (value == this.answer.length - 2 || (value == this.answer.length - 3 && this.answer[this.answer.length - 2] == '.')) {
            const starterEl = eval(`this.$refs.element${(value + 1).toString()}[0]`);
            starterEl.classList.add("visible");
          }
        }
      }*/
    }
  },
  methods: {
    setup() {
      this.numDecimalFractions = Math.max(precision(this.numInitialLeft), precision(this.numInitialRight));
      this.strGroomedLeft = this.numInitialLeft.toFixed(this.numDecimalFractions);
      this.strGroomedRight = this.numInitialRight.toFixed(this.numDecimalFractions);
      this.numColumnsOperand = greatestNumColumn(this.strGroomedLeft, this.strGroomedRight);
      this.computeMathProblem();
      this.initUserInput();
      this.diffAnswerLengthAndOperandLength = this.answer.length - this.numColumnsOperand;
    },
    isAutoCarry() {
      console.dir(this.$refs);
      if (this.userInput[this.sequence - 1] === '.') {
        if (this.carryArr[this.sequence - 2] === '1') {
          if (this.userInput[this.sequence] === this.answer[this.sequence]) {
            /*const el = eval(`this.$refs.carryundefined${this.sequence - 2}[0]`);
            el.style.visibility = "visible"*/
            return "visible";
          }
        }
      } else {
        if (this.carryArr[this.sequence - 1] === '1') {
          if (this.userInput[this.sequence] === this.answer[this.sequence]) {
            /*const el = eval(`this.$refs.carryundefinded${this.sequence - 1}[0]`);
            el.style.visibility = "visible";*/
            return "visible";
          }
        }
        
      }
      return "hidden";
    },
    retainValue(index: number) {
      if (this.sequence === index) {
        const el = eval(`this.$refs.element${this.sequence}[0]`);
        el.value = this.retainedValue;
        el.disabled = true;
        this.userInput[this.sequence] = this.retainedValue;
        this.moveSequence();
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
    isDisabled(index: number, value: string) {
      if (this.sequence !== index) {
        return true;
      }
      return false;
    },
    moveSequence() {
      // scan left
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
    },
    moveSequenceOnEdit(index: number) {
      this.onEdit = true;
      if (this.userInput[index] !== '.') {
        this.userInput[index] = '';
        const el = eval(`this.$refs.element${index}[0]`);
        el.disabled = false;
        //el.value = '';
        el.focus();
        console.dir(el);
        this.sequence = index;
        this.moveSequence();
      }
    },
    alignColumns(replacementCharacter: string, str: string) {
      let diff = this.numColumnsOperand - str.length;
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
      const left = this.alignColumns('0', this.strGroomedLeft);
      const right = this.alignColumns('0', this.strGroomedRight);
      const answerArr: string[] = [];
      for (let i = 0; i < this.numColumnsOperand; i++) {
        if (left[i] !== '.') {
          answerArr.push('0');
        } else {
          answerArr.push('.');
        }
      }
      for (let i = this.numColumnsOperand - 1; i >= 0; i--) {
        this.carryArr.push('');
        if (left[i] !== '.') {
          const answer = (Number(left[i]) + Number(right[i]) + Number(answerArr[i])).toString();
          if (answer.length === 2) {
            const carry: string[] = Array.from(answer);
            answerArr[i] = carry[1];
            if ((answerArr[i - 1]) && answerArr[i - 1] === '.') {
              // we know there is a number before the decimal point
              answerArr[i - 2] = carry[0];
              this.carryArr[i - 2] = carry[0];
            } else if ((answerArr[i - 1])) {
              answerArr[i - 1] = carry[0];
              this.carryArr[i - 1] = carry[0];
            } else {
              // we need to add another column
              answerArr.unshift(carry[0]);
              this.carryArr.unshift(carry[0]);
            }
          } else {
            answerArr[i] = answer;
          }
        }
      }
      this.answer = answerArr;
      this.sequence = this.answer.length - 1;
    },
    isNumber(event: any, index: number) {
      event = (event) ? event : window.event;
      let charCode = (event.which) ? event.which : event.keyCode;
      console.log(charCode)
      if (charCode === 13 || (charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        event.preventDefault();
      } else {
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
          this.moveSequence();
          return true;
        } else {
          event.preventDefault();
        }
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
export default class AdditionComponent extends Vue {}
</script>

<!-- STYLE -->
<style scoped lang="scss">
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
