import { createApp } from 'vue'
import {createStore} from "vuex"
import App from './App.vue'
import './registerServiceWorker'
import './assets/tailwind.css'
const store = createStore({
    state(){
        return {
            Calendar: null,
            currentYear: null,
            currentIndexedMonth: null,
            current: {
                year: null,
                month: new Date().getDay(),
                day: new Date().getDay(),
                days: [],
                indexedMonth: new Date().getMonth(),
            },
            months:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        }
    },
    mutations: {
        updateIDB(state,payload) { /*{{{*/
            const Calendar = state.Calendar
            const months = state.months
            const currentYear = payload.currentYear
            //remove vue's proxy wrap
            const nonProxy = JSON.parse(JSON.stringify(Array.from(Calendar.get(currentYear))))
            const mapNonProxy = new Map(nonProxy)
            // console.log(mapNonProxy)
            months.forEach(months => {
                mapNonProxy.set(months, [])
                Calendar.get(payload.currentYear).get(months).forEach(days => {
                    const parsedDays = JSON.parse(JSON.stringify(Array.from(days)))
                    const [[key,value]] = parsedDays
                    mapNonProxy.get(months).push(new Map([[key,value]]))
                })

            })
            // updating IDB
            const openReq = indexedDB.open("calendar", currentYear)
            openReq.onsuccess = ev => {
                let tx = openReq.result.transaction(`${currentYear}`, "readwrite").objectStore(`${currentYear}`)
                tx.getAll().onsuccess = ev => {
                    const base = ev.target.result
                    const baseId = base[0].id || null
                    console.log(baseId)
                    tx.put({id:baseId, content:mapNonProxy})
                }
            }

        },
        /*}}}*/
        updateCalendar(state,payload,){ /*{{{*/
            //year,month,day,content 
            state.Calendar.get(payload.year).get(payload.month)[payload.day-1].set(payload.day,payload.content) //updating Calendar
        },/*}}}*/
        get(state) {
            return state.Calendar
        }

    },
})
const app = createApp(App)
app.use(store)
app.mount("#app")
