import { getChart } from "../../components/utils.js";
import { addChart as addLine, updateChart as updateLine } from "./charts/line.js";
import { addChart as addStackedArea, updateChart as updateStackedArea } from "./charts/stacked-area.js";
import { handleInputChange } from "../../components/html/slider/script.js";

const getData = () =>
    d3.csv('./data/unemployment.csv')
        .then(d => d.map(v => {
            return {
                measureDate: new Date(v.isoDate + 'T03:00:00Z'),
                working: +v.working * 1e3,
                notWorking: +v.notWorking * 1e3,
                outOfWorkforce: +v.outOfWorkforce * 1e3,
                unemploymentRate: +v.notWorking / (+v.working + +v.notWorking)
            }
        }))

const svgHeight = (window.innerHeight
    - document.getElementById('header').offsetHeight
    - document.getElementById('caption').offsetHeight) / 2
    - 64

const percentReallyWorking = document.getElementById('percent-really-working')
handleInputChange({ target: percentReallyWorking })

const percentReallyOutOfWork = document.getElementById('percent-really-out-of-work')
handleInputChange({ target: percentReallyOutOfWork })

getData().then(data => {
    const lineChartObject = addLine(
        getChart(
            'chart1',
            document.getElementById('chart1-container').offsetWidth,
            svgHeight
        ),
        data
    )

    const stackedAreaChartObject = addStackedArea(
        getChart(
            'chart2',
            document.getElementById('chart2-container').offsetWidth,
            svgHeight,
            {
                left: 64,
                right: 16,
                top: 32,
                bottom: 56
            }
        ),
        data
    )

    percentReallyWorking.addEventListener('change', (event) => {
        const newData = data.map(d => {
            const newWorking = d.working * event.target.value / 100
            const newNotWorking = d.notWorking + d.working - newWorking

            return {
                ...d,
                working: newWorking,
                notWorking: newNotWorking,
                unemploymentRate: newNotWorking / (newWorking + newNotWorking)
            }
        })

        updateLine({ ...lineChartObject, data: newData })
        updateStackedArea({ ...stackedAreaChartObject, data: newData })
    })
})