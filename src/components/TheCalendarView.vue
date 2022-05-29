<template>
    <div>
        <div>
            <svg @click="this.prevMonth()" xmlns="http://www.w3.org/2000/svg" class="transition-all inline cursor-pointer hover:fill-neutral-300 fill-neutral-400 rotate-180" width="24" height="24" viewBox="0 0 24 24"><path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"/></svg>
            <p class="inline px-8 text-neutral-50">{{currentIndexedMonth}}</p>
            <svg @click="this.nextMonth()" xmlns="http://www.w3.org/2000/svg" class="transition-all inline cursor-pointer hover:fill-neutral-300 fill-neutral-400" width="24" height="24" viewBox="0 0 24 24"><path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"/></svg>
        </div>
        <div class="grid py-4 place-items-center">
            <div id="days" class="grid gap-2">
                <p v-for="days in this.weekdays" :class="[(days == 'Su' || days == 'Sa')?'text-red-400':'']">{{days}}</p>
                <p :class="[ (this.getIndexedDays(days).getDay() == 0||this.getIndexedDays(days).getDay() == 6)?'text-red-400':'' , (days === this.currentDay && this.$store.state.current.indexedMonth === new Date().getMonth()) ? 'underline text-white' : '',]"
                    :style="{gridColumnStart: this.getIndexedDays(days).getDay() + 1}"
                    v-for="days in this.$store.state.current.days" >
                    <!-- <span :style="{'grid-column-start': 3}">{{days}}</span> -->
                    <p >{{days}}</p>
                </p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            currentDay: new Date().getDate(),
            months: this.$store.state.months,
            weekdays : ["Su","Mo","Tu","We","Th","Fr","Sa"],
        }
    },
    beforeMount() {
        this.getMonthsDays()
        this.$store.state.current.month = this.months[new Date().getMonth()]
    },
    computed: {
        currentIndexedMonth() {
            return this.months[this.$store.state.current.indexedMonth]
        },
        currentMonth() {
            return this.months[new Date().getMonth()]
        }

    },
    methods: {
        getIndexedDays(day) {
            return new Date(this.$store.state.current.year, this.$store.state.current.indexedMonth, day)
        },//helper function
        getMonthsDays() {
            const openReq = indexedDB.open("calendar",this.$store.state.current.year)
            openReq.onsuccess = ev => {
                let tx = openReq.result.transaction(`${this.$store.state.current.year}`, "readwrite").objectStore(`${this.$store.state.current.year}`)
                tx.getAll().onsuccess = ev => {
                    const got = this.$store.state.Calendar.get(this.$store.state.current.year)
                    // this.currentDays = {sun:[],mon:[],tue:[],wed:[],thu:[],fri:[],sat:[]}
                    this.$store.state.current.days = []
                    got.get(this.months[this.$store.state.current.indexedMonth]).forEach((i,I) => {
                        const days = [...i][0][0]
                        this.$store.state.current.days.push(days) 
                    })
                }
                // const [[key,value]] = [...this.$store.state.Calendar[0][1]]
            }
        },
        nextMonth() {
            if (this.$store.state.current.indexedMonth === this.months.length - 1){
                this.$store.state.current.indexedMonth = 0
                this.getMonthsDays()
            }else{
                this.$store.state.current.indexedMonth++
                this.getMonthsDays()
            }
        },
        prevMonth() {
            if (this.$store.state.current.indexedMonth === 0){
                this.$store.state.current.indexedMonth = 11
                this.getMonthsDays()
            }else{
                this.$store.state.current.indexedMonth--
                this.getMonthsDays()
            }
        }
        
    },
    
}
</script>
<style scoped>
#days{
    grid-template-columns: repeat(7,50px);
}
#jan{
    grid-column-start: 1;
}

</style>
