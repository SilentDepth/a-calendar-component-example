<template>
<div id="app" class="pt-10 flex flex-col items-center">
  <input v-model="date" type="date" class="mb-4 border border-gray-400">
  <a-calendar v-model="date"/>
</div>
</template>

<script>
import ACalendar from './components/a-calendar.vue'

export default {
  components: {
    ACalendar,
  },

  data () {
    return {
      date: undefined,
    }
  },
}
</script>
