<template>
<div :class='[container, "spot"]' hidden>
  <div class='row'>
    <div class='output'>{{ result }} {{ formula }}</div>
    <div class='btn btn-primary enter' @click="equal">=</div>
  </div>
  <div class='row'>
    <div class='btn btn-primary num' @click="append('7')">7</div>
    <div class='btn btn-primary num' @click="append('8')">8</div>
    <div class='btn btn-primary num' @click="append('9')">9</div>
    <div class='btn btn-info op' @click="append('+')">+</div>
  </div>
  <div class='row'>
    <div class='btn btn-primary num' @click="append('4')">4</div>
    <div class='btn btn-primary num' @click="append('5')">5</div>
    <div class='btn btn-primary num' @click="append('6')">6</div>
    <div class='btn btn-info op' @click="append('-')">-</div>
  </div>
  <div class='row'>
    <div class='btn btn-primary num' @click="append('1')">1</div>
    <div class='btn btn-primary num' @click="append('2')">2</div>
    <div class='btn btn-primary num' @click="append('3')">3</div>
    <div class='btn btn-info op' @click="append('*')">*</div>
  </div>
  <div class='row'>
    <div class='btn btn-primary num' @click="append('0')">0</div>
    <div class='btn btn-danger' @click="clean">C</div>
    <div class='btn btn-default' @click="pop">Del</div>
    <div class='btn btn-info op' @click="append('/')">/</div>
  </div>
</div>
</template>

<script>
class Calculation {
  constructor() {
    this._symbols = {}
    this.defineOperator('**', Math.pow, 'infix', 5, true)
    this.defineOperator('*', this.multiplication, 'infix', 4)
    this.defineOperator('/', this.division, 'infix', 4)
    this.defineOperator('+', this.last, 'prefix', 3)
    this.defineOperator('-', this.negation, 'prefix', 3)
    this.defineOperator('+', this.addition, 'infix', 2)
    this.defineOperator('-', this.subtraction, 'infix', 2)
    this.defineOperator('(', this.last, 'prefix')
    this.defineOperator(')', null, 'postfix')
  }
  defineOperator(symbol, f, notation = 'func', precedence = 0, rightToLeft = false) {
    // Store operators keyed by their symbol/name. Some symbols may represent
    // different usages: e.g. "-" can be unary or binary, so they are also
    // keyed by their notation (prefix, infix, postfix, func):
    if (notation === 'func') precedence = 0
    this._symbols[symbol] = Object.assign({}, this._symbols[symbol], {
      [notation]: {
        symbol, f, notation, precedence, rightToLeft, argCount: 1 + (notation === 'infix')
      },
      symbol,
      regSymbol: symbol.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&') +
        (/\w$/.test(symbol) ? '\\b' : '') // add a break if it's a name
    })
  }
  last(...a) { return a[a.length - 1] }
  negation(a) { return -a }
  addition(a, b) { return a + b }
  subtraction(a, b) { return a - b }
  multiplication(a, b) { return a * b }
  division(a, b) { return a / b }
  calculate(expression) {
    let match
    const values = []
    const operators = [this._symbols['('].prefix]
    const exec = _ => {
      let op = operators.pop()
      values.push(op.f(...[].concat(...values.splice(-op.argCount))))
      return op.precedence
    }
    const error = msg => {
      let notation = match ? match.index : expression.length
      return `${msg} at ${notation}:\n${expression}\n${' '.repeat(notation)}^`
    }
    const pattern = new RegExp(
      // Pattern for numbers
      '\\d+(?:\\.\\d+)?|' +
      // ...and patterns for individual operators/function names
      Object.values(this._symbols)
        // longer symbols should be listed first
        .sort((a, b) => b.symbol.length - a.symbol.length)
        .map(val => val.regSymbol).join('|') +
      '|(\\S)', 'g'
    )
    let afterValue = false
    pattern.lastIndex = 0 // Reset regular expression object
    do {
      match = pattern.exec(expression)
      const [token, bad] = match || [')', undefined]
      const notNumber = this._symbols[token]
      const notNewValue = notNumber && !notNumber.prefix && !notNumber.func
      const notAfterValue = !notNumber || !(notNumber.postfix || notNumber.infix)
      // Check for syntax errors:
      if (bad || (afterValue ? notAfterValue : notNewValue)) return error('Syntax error')
      if (afterValue) {
        // We either have an infix or postfix operator (they should be mutually exclusive)
        const curr = notNumber.postfix || notNumber.infix
        do {
          const prev = operators[operators.length - 1]
          if (((curr.precedence - prev.precedence) || prev.rightToLeft) > 0) break
          // Apply previous operator, since it has precedence over current one
        } while (exec()) // Exit loop after executing an opening parenthesis or function
        afterValue = curr.notation === 'postfix'
        if (curr.symbol !== ')') {
          operators.push(curr)
          // Postfix always has precedence over any operator that follows after it
          if (afterValue) exec()
        }
      } else if (notNumber) { // prefix operator or function
        operators.push(notNumber.prefix || notNumber.func)
        if (notNumber.func) { // Require an opening parenthesis
          match = pattern.exec(expression)
          if (!match || match[0] !== '(') return error('Function needs parentheses')
        }
      } else { // number
        values.push(+token)
        afterValue = true
      }
    } while (match && operators.length)
    return operators.length ? error('Missing closing parenthesis')
      : match ? error('Too many closing parentheses')
        : values.pop() // All done!
  }
}
const calcu = new Calculation()
export default {
  name: 'calculator',
  props: ['initial', 'container', 'handler'],
  data() {
    return {
      formula: '',
      result: this.initial
    }
  },

  methods: {
    append(element) {
      this.formula += element
    },
    pop() {
      if (this.formula.length) {
        this.formula = this.formula.slice(0, -1)
      } else {
        this.result = `${this.result}`.slice(0, -1)
      }
    },
    equal() {
      this.result = calcu.calculate(this.result + this.formula)
      this.formula = ''
      this.handler(this.result)
      this.$emit('close')
    },
    clean() {
      this.formula = ''
      this.result = this.initial
    }
  }
}
</script>

<style lang="sass" scoped>
$w: 85vmin
$h: 85vmin
=output($bc, $color)
  flex-direction: column
  justify-content: space-evenly
  align-items: stretch
  background-color: $bc
  width: $w
  height: $h
  user-select: none
  font-size: 10vmin
  border-radius: 0.4rem
  .row
    justify-content: space-evenly
    align-items: stretch
  .row > .btn
    flex-basis: 18vmin
    border-radius: 8px
    box-shadow: 0.1rem 0.1rem 0.3rem rgb(85, 65, 65)
    &:active
      color: #f1f5f7
      transform: translate(0.05rem, 0.05rem)
      box-shadow: 0.3rem 0.3rem 0.5rem black
  .output
    flex-basis: 59vmin
    border: 3px solid $color
    color: $color
  .btn-primary
    color: #fff
    background-color: #428bca
    border-color: #357ebd
    &:active, &:hover
      background-color: #3276b1
      border-color: #285e8e
  .btn-danger
    color: #fff
    background-color: #d9534f
    border-color: #d43f3a
    &:active, &:hover
      background-color: #d2322d
      border-color: #ac2925
  .btn-default
    color: #333
    background-color: #fff
    border-color: #ccc
    &:active, &:hover
      background-color: #ebebeb
      border-color: #adadad
  .btn-info
    color: #fff
    background-color: #5bc0de
    border-color: #46b8da
    &:active, &:hover
      background-color: #39b3d7
      border-color: #269abc
.for-hp
  +output(#f4cccc,red)
.for-sp
  +output(#d0e0e3,blue)
</style>
