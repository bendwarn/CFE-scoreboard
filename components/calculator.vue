<template>
  <dialog
    class="grid grid-cols-4 gap-2 rounded-lg p-3 text-5xl opacity-0 shadow-lg transition duration-200 backdrop:backdrop-blur open:opacity-100"
    :class="bg"
    ref="dialog"
    @click.self="close"
  >
    <div class="col-span-3 rounded-xl border-4 text-4xl" :class="areaColor">
      {{ result }} {{ formula }}
    </div>
    <div
      class="rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 active:bg-blue-700 active:hover:scale-105 active:hover:shadow-md"
      @click="equal"
    >
      =
    </div>
    <div
      class="rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 active:bg-blue-700 active:hover:scale-105 active:hover:shadow-md"
      @click="append('7')"
    >
      7
    </div>
    <div
      class="rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 active:bg-blue-700 active:hover:scale-105 active:hover:shadow-md"
      @click="append('8')"
    >
      8
    </div>
    <div
      class="rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 active:bg-blue-700 active:hover:scale-105 active:hover:shadow-md"
      @click="append('9')"
    >
      9
    </div>
    <div
      class="rounded-lg bg-blue-300 text-white shadow hover:bg-blue-400 active:bg-blue-400 active:hover:scale-105 active:hover:shadow-md"
      @click="append('+')"
    >
      +
    </div>
    <div
      class="rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 active:bg-blue-700 active:hover:scale-105 active:hover:shadow-md"
      @click="append('4')"
    >
      4
    </div>
    <div
      class="rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 active:bg-blue-700 active:hover:scale-105 active:hover:shadow-md"
      @click="append('5')"
    >
      5
    </div>
    <div
      class="rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 active:bg-blue-700 active:hover:scale-105 active:hover:shadow-md"
      @click="append('6')"
    >
      6
    </div>
    <div
      class="rounded-lg bg-blue-300 text-white shadow hover:bg-blue-400 active:bg-blue-400 active:hover:scale-105 active:hover:shadow-md"
      @click="append('-')"
    >
      -
    </div>
    <div
      class="rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 active:bg-blue-700 active:hover:scale-105 active:hover:shadow-md"
      @click="append('1')"
    >
      1
    </div>
    <div
      class="rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 active:bg-blue-700 active:hover:scale-105 active:hover:shadow-md"
      @click="append('2')"
    >
      2
    </div>
    <div
      class="rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 active:bg-blue-700 active:hover:scale-105 active:hover:shadow-md"
      @click="append('3')"
    >
      3
    </div>
    <div
      class="rounded-lg bg-blue-300 text-white shadow hover:bg-blue-400 active:bg-blue-400 active:hover:scale-105 active:hover:shadow-md"
      @click="append('*')"
    >
      *
    </div>
    <div
      class="rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 active:bg-blue-700 active:hover:scale-105 active:hover:shadow-md"
      @click="append('0')"
    >
      0
    </div>
    <div
      class="rounded-lg bg-red-600 text-white shadow hover:bg-red-700 active:bg-red-700 active:hover:scale-105 active:hover:shadow-md"
      @click="clean"
    >
      C
    </div>
    <div
      class="rounded-lg bg-white text-gray-900 shadow active:hover:scale-105 active:hover:bg-gray-100 active:hover:shadow-md"
      @click="pop"
    >
      Del
    </div>
    <div
      class="rounded-lg bg-blue-300 text-white shadow hover:bg-blue-400 active:bg-blue-400 active:hover:scale-105 active:hover:shadow-md"
      @click="append('/')"
    >
      /
    </div>
  </dialog>
</template>

<script lang="ts">
import { add, multiply, subtract, divide } from 'lodash-es'
const last = (...a: any[]) => a[a.length - 1]
class Calculation {
  _symbols: Record<string, Record<string, any>> = {}
  constructor() {
    this.defineOperator('**', Math.pow, 'infix', 5, true)
    this.defineOperator('*', multiply, 'infix', 4)
    this.defineOperator('/', divide, 'infix', 4)
    this.defineOperator('+', last, 'prefix', 3)
    this.defineOperator('-', (x: number) => subtract(0, x), 'prefix', 3)
    this.defineOperator('+', add, 'infix', 2)
    this.defineOperator('-', subtract, 'infix', 2)
    this.defineOperator('(', last, 'prefix')
    this.defineOperator(')', null, 'postfix')
  }
  defineOperator(
    symbol: string,
    f: Function | null,
    notation = 'func',
    precedence = 0,
    rightToLeft = false
  ) {
    // Store operators keyed by their symbol/name. Some symbols may represent
    // different usages: e.g. "-" can be unary or binary, so they are also
    // keyed by their notation (prefix, infix, postfix, func):
    if (notation == 'func') precedence = 0
    this._symbols[symbol] = Object.assign({}, this._symbols[symbol], {
      [notation]: {
        symbol,
        f,
        notation,
        precedence,
        rightToLeft,
        argCount: 1 + +(notation == 'infix'),
      },
      symbol,
      regSymbol:
        symbol.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&') + (/\w$/.test(symbol) ? '\\b' : ''), // add a break if it's a name
    })
  }
  calculate(expression: string) {
    let match: any
    const values: number[] = []
    const operators = [this._symbols['('].prefix]
    const exec = () => {
      const op = operators.pop()
      values.push(op.f(...values.splice(-op.argCount as number)))
      return op.precedence
    }
    const error = (msg: string) => {
      const notation = match ? match.index : expression.length
      return `${msg} at ${notation}:\n${expression}\n${' '.repeat(notation)}^`
    }
    const pattern = new RegExp(
      // Pattern for numbers
      '\\d+(?:\\.\\d+)?|' +
        // ...and patterns for individual operators/function names
        Object.values(this._symbols)
          // longer symbols should be listed first
          .sort((a, b) => b.symbol.length - a.symbol.length)
          .map((val) => val.regSymbol)
          .join('|') +
        '|(\\S)',
      'g'
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
      if (bad || (afterValue ? notAfterValue : notNewValue)) {
        return error('Syntax error')
      }
      if (afterValue) {
        // We either have an infix or postfix operator (they should be mutually exclusive)
        const curr = notNumber.postfix || notNumber.infix
        do {
          const prev = operators[operators.length - 1]
          if ((curr.precedence - prev.precedence || prev.rightToLeft) > 0) break
          // Apply previous operator, since it has precedence over current one
        } while (exec()) // Exit loop after executing an opening parenthesis or function
        afterValue = curr.notation == 'postfix'
        if (curr.symbol != ')') {
          operators.push(curr)
          // Postfix always has precedence over any operator that follows after it
          if (afterValue) exec()
        }
      } else if (notNumber) {
        // prefix operator or function
        operators.push(notNumber.prefix || notNumber.func)
        if (notNumber.func) {
          // Require an opening parenthesis
          match = pattern.exec(expression)
          if (!match || match[0] != '(') {
            return error('Function needs parentheses')
          }
        }
      } else {
        // number
        values.push(+token!)
        afterValue = true
      }
    } while (match && operators.length)
    if (operators.length) {
      return error('Missing closing parenthesis')
    } else if (match) {
      return error('Too many closing parentheses')
    } else {
      return values.pop() // All done!
    }
  }
}
export const calcu = new Calculation()
</script>
<script setup lang="ts">
const props = defineProps<{ initial: string; container: string }>()
const emit = defineEmits<{
  (e: 'giveResult', value: string): void
}>()
const dialog = ref()
const formula = ref('')
const result = ref('')
watch(
  props,
  (v) => {
    result.value = v.initial
  },
  { immediate: true }
)
const popError = autoResetRef('', 2000)
const bg = computed(() => ({ hp: 'bg-red-100', sp: 'bg-blue-100' }[props.container]))
const areaColor = computed(
  () =>
    ({
      hp: 'text-red-500 border-red-500',
      sp: 'text-blue-500 border-blue-500',
    }[props.container])
)
const append = (element: string) => {
  formula.value += element
}
const pop = () => {
  if (formula.value.length) {
    formula.value = formula.value.slice(0, -1)
  } else {
    result.value = result.value.slice(0, -1)
  }
}
const equal = () => {
  try {
    result.value = `${calcu.calculate(result.value + formula.value)}`
    emit('giveResult', result.value)
  } finally {
    popError.value = '語法錯誤'
  }
  close()
}
const clean = () => {
  formula.value = ''
  result.value = props.initial
}
const close = () => {
  clean()
  unrefElement(dialog).close()
}
</script>
