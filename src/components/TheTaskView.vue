<template>
    <div id="title" class=" relative py-8 h-full ">
        <div class="flex py-4 text-3xl text-neutral-300 justify-center">
            <div class="px-4"> {{this.$store.state.current.month}} </div>
            <!-- <div> {{new Date().getDate()}} </div> -->
        </div>
        <div>
            <!-- {{test}} -->
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            calendar: null,
        }
    },
    beforeMount() {
        this.getCalendarIDB()
    },
    computed: {
        test() {
            console.log(this.calendar.get("Jan"))
        }
    },
    methods: {
        getCalendarIDB(monthIndex=(new Date().getMonth()),date=(new Date().getDate())) {
            const openReq = indexedDB.open("calendar",this.$store.state.current.year)
            openReq.onsuccess = ev => {
                let tx = openReq.result.transaction(`${this.$store.state.current.year}`, "readwrite").objectStore(`${this.$store.state.current.year}`)
                tx.getAll().onsuccess = ev => {
                    const got = this.$store.state.Calendar.get(this.$store.state.current.year)
                    this.calendar = got
                    // this.currentDays = {sun:[],mon:[],tue:[],wed:[],thu:[],fri:[],sat:[]}
                    /* const month = this.$store.state.months[monthIndex]
                    console.log(got.get(month)[date-1].get(date))
                    return got.get(month)[date-1].get(date) */
                }
                // const [[key,value]] = [...this.$store.state.Calendar[0][1]]
            }

        }
    },
}
</script>
<style scoped>

#title::before {
    position: absolute;
    content: "";
    height: 100%;
    width: 100%;
    right: 0;
    z-index: -1;
    @apply bg-neutral-900 opacity-60;
}
</style>
