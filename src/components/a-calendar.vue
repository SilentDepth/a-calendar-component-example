<template>
<div class="p-4 border border-gray-400 rounded">
  <div class="flex items-center">
    <h1>{{ calendarYear }} 年 {{ calendarMonth }} 月</h1>
    <div class="ml-auto flex">
      <button class="flex-1 w-10 h-10 text-sm hover:bg-gray-200 rounded flex justify-center items-center" @click="calendarMonth--">上月</button>
      <button class="flex-1 w-10 h-10 text-sm hover:bg-gray-200 rounded flex justify-center items-center" @click="calendarRefDate = new Date()">本月</button>
      <button class="flex-1 w-10 h-10 text-sm hover:bg-gray-200 rounded flex justify-center items-center" @click="calendarMonth++">下月</button>
    </div>
  </div>
  <div class="h-10 text-sm text-center text-gray-500 flex items-center">
    <span v-for="day of WEEKDAYS" :key="day" class="flex-1">{{ day }}</span>
  </div>
  <div class="grid grid-cols-7 place-items-center">
    <button
      v-for="d of calendarDates"
      :key="d.getTime()"
      :class="[
        'w-10 h-10 rounded',
        isSameDay(d, valueDate) ? 'bg-blue-200' : 'hover:bg-gray-200',
        d.getMonth() + 1 !== calendarMonth ? 'text-gray-500' : 'font-medium',
        { 'text-yellow-500': isSameDay(d, today) },
      ]"
      @click="setValue(d)"
    >{{ d.getDate() }}</button>
  </div>
</div>
</template>

<script>
const WEEKDAYS = '日一二三四五六'.split('')

/**
 * 将日期格式化为 YYYY-MM-DD 形式
 *
 * @param {Date} date
 * @returns {string}
 */
function formatDate (date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

/**
 * 将日期字符串（YYYY-MM-DD 形式）解析为 Date
 *
 * @param {string} dateStr
 * @returns {Date}
 */
function parseDate (dateStr) {
  const [year, month, date] = /** @type {[number, number, number]} */ dateStr.split('-').map(Number)
  return new Date(year, month - 1, date)
}

export default {
  model: {
    // v-model prop 的默认值就是 value，不需要特意声明
    // prop: 'value',
    // v-model event 的默认值是 input，这里改用 change，更符合业务含义
    event: 'change',
  },

  props: {
    // 我们的目标是对接 <input type=date>，而它接受的 value 类型是字符串，因此以 String 定义 prop
    //
    // 根据编码风格指南，这里应当使用完整定义形式并指定默认值。但此处的默认值就是 undefined，因此使用简化形式
    value: String,
  },

  data () {
    return {
      // 缓存「今天」
      today: new Date(),
      // 月历的参考日期，用于确定当前显示的年份和月份
      // 使用 Date 可以简化计算逻辑。年和月之外的信息是无用的
      calendarRefDate: new Date(this.value ? parseDate(this.value) : Date.now()),

      WEEKDAYS,
    }
  },

  computed: {
    // value 的 Date 形式
    valueDate () { return this.value && parseDate(this.value) },
    // 当前月历年份
    calendarYear () { return this.calendarRefDate.getFullYear() },
    // 当前月历月份
    calendarMonth: {
      get () { return this.calendarRefDate.getMonth() + 1 },
      set (value) {
        const date = new Date(this.calendarRefDate)
        // 利用 Date API 可以很方便地处理跨年问题
        date.setMonth(value - 1)
        this.calendarRefDate = date
      },
    },
    // 当前月总共要显示的日期
    calendarDates () {
      // 由于月历第一列固定是周日，因此可以通过当前月第一天的星期计算上一月有几天需要显示
      const firstWeekday = new Date(this.calendarYear, this.calendarMonth - 1, 1).getDay()
      const lastDateOfPrevMonth = new Date(this.calendarYear, this.calendarMonth - 1, 0).getDate()
      const prevMonthDates = Array.from({ length: firstWeekday }, (_, idx) => new Date(this.calendarYear, this.calendarMonth - 2, lastDateOfPrevMonth - idx)).reverse()

      // 利用 Date API 快速判断当前月的最后一天是几号，无需特意计算闰月
      const lastDateOfThisMonth = new Date(this.calendarYear, this.calendarMonth, 0).getDate()
      const thisMonthDates = Array.from({ length: lastDateOfThisMonth }, (_, idx) => new Date(this.calendarYear, this.calendarMonth - 1, idx + 1))

      // 根据最后一天的星期计算出下一月有几天需要显示
      const lastWeekday = new Date(this.calendarYear, this.calendarMonth - 1, lastDateOfThisMonth).getDay()
      const nextMonthDates = Array.from({ length: 6 - lastWeekday }, (_, idx) => new Date(this.calendarYear, this.calendarMonth, idx + 1))

      return [...prevMonthDates, ...thisMonthDates, ...nextMonthDates]
    },
  },

  methods: {
    /**
     * 判断两个日期是否属于同一天（忽略时间）
     *
     * @param {Date} a
     * @param {Date} b
     * @returns {boolean}
     */
    isSameDay (a, b) {
      return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
    },
    /**
     * 设定当前选择的日期
     *
     * @param {Date} date
     */
    setValue (date) {
      // 更新月历参考日期，以在选择非当前月日期时跳转到目标月份
      this.calendarRefDate = date
      this.$emit('change', formatDate(date))
    },
  },
}
</script>
