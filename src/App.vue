<template>
    <div id="container" class=" text-xl bg-scroll text-neutral-400 bg-neutral-900 h-screen m-0">
        <div class="overflow-auto px-2 h-full">
            <Calendar class="py-4"></Calendar>
            <task-view></task-view>
        </div>
    </div>
</template>

<script>
import Calendar from './components/TheCalender'
import TaskView from './components/TheTaskView.vue'

export default {
    name: 'App',
    components: {
      Calendar,
      TaskView,
    },
    data() {
        return {
            dB:null,
        }
    },
    provide() {
        return {
            openReq: this.dB
        }
    } ,
    methods: {
    },
    beforeMount () {
    }
}
    
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow:hidden;
  text-align: center;
  color: #2c3e50;
}
::-webkit-scrollbar {
    width: 0.15em;
    @apply rounded-xl;
}
::-webkit-scrollbar-track {
    background: #4040409c;
}
/* ::-webkit-scrollbar-button {
    background: blue
} */
::-webkit-scrollbar-thumb {
    @apply bg-red-400 opacity-0
}
#container {
    background: url("./assets/default.png") no-repeat;
    background-position: center;
    background-size: cover;
    position: relative;
    z-index: 1;
}
#container::before {
    position: absolute;
    content: "";
    height: 100%;
    width: 100%;
    right: 0;
    z-index: -1;
    @apply bg-neutral-900 opacity-60;
}
</style>
