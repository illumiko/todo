<template>
    <div>
        <View></View>
    </div>
</template>
<script>
import View from "./TheCalendarView.vue"
export default {
    components: {
        View,
    },
    data() {
        return {
            months:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
            currentYear: null,
            currentMonth: new Date().getMonth(),
            Calendar: null,
            DB: null,
        }
    },
    methods: {
        GenerateYear() { /*{{{*/
            // generates calendar for the year based on conditions 
            const currentDateObj = new Date()
            // const currentYear = currentDateObj.getFullYear()
            this.currentYear = currentDateObj.getFullYear()
            const leapYearFeb = Array.from({length:29}, ((_,i) => i+1))
            const oddMonth = Array.from({length:31}, ((_,i) => i+1))
            const evenMonth = Array.from({length:30}, ((_,i) => i+1))
            const feb = Array.from({length:28}, ((_,i) => i+1))
            let cal = new Map()
            cal.set(this.currentYear,new Map())
            this.months.forEach((i,I) => {
                // let I = index+1
                if (I === 0 || I === 2 || I === 4 || I === 6 || I === 7 || I === 8 || I === 11) {
                    cal.get(this.currentYear).set(i,oddMonth.map(i => new Map(([[i,"Hello"]]))))
                }
                else {
                    cal.get(this.currentYear).set(i,evenMonth.map(i => new Map(([[i,""]]))))
                }
                if (I === 1) {
                    if(this.currentYear % 4 === 0) {
                        cal.get(this.currentYear).set(i,leapYearFeb.map(i => new Map(([[i,""]]))))
                    }else{
                        cal.get(this.currentYear).set(i,feb.map(i => new Map([[i, ""]])))
                    }
                }
            });
            // console.log(idkMah.get(2022).get("Jan")[0].get(1))
            return cal
        },/*}}}*/
        
    },
    beforeMount(){
        //checks of calendar entry for current year exists or not and if not then adds it{{{
        const calendar = this.GenerateYear()
        this.$store.state.current.year = this.currentYear //setting currentYear
        const id = calendar.keys().next().value
        const obj = {
            id: id,
            content: calendar
        }
        const ifExist = (storeName) => {
            if(!openReq.result.objectStoreNames.contains(storeName)) {
                openReq.result.createObjectStore(storeName, {keyPath: "id", autoIncrement:true})
            }
        }
        //init DB
        const openReq = indexedDB.open("calendar", this.currentYear)
        openReq.onerror = (err) => console.warn(err)
        openReq.onsuccess = (ev) => {
            console.log('~~calendar DB inited~~')
            let tx = openReq.result.transaction(`${this.currentYear}`, "readwrite").objectStore(`${this.currentYear}`)
            tx.getAll().onsuccess = ev => {
                const got = ev.target.result
                if(got.length){
                    this.$store.state.Calendar = got[0].content
                }else {
                    tx.add(obj)
                    this.$store.state.Calendar = obj.content

                }
            }
        }
        openReq.onupgradeneeded = (ev) => {
            ifExist(`${this.currentYear}`)
        }/*}}}*/
        
    }
}
</script>
