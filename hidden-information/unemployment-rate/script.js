import { getChart, handleInputChange } from "../../node_modules/visual-components/index.js"
import { addChart as addLine, updateChart as updateLine } from "./charts/line.js"
import { addChart as addStackedArea, updateChart as updateStackedArea } from "./charts/stacked-area.js"

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

const percentWorking = document.getElementById('percent-working')
handleInputChange({ target: percentWorking })

const percentOutOfWorkforce = document.getElementById('percent-out-of-workforce')
handleInputChange({ target: percentOutOfWorkforce })

getData().then(data => {
    const lineChartObject = addLine(
        getChart({
            id: 'chart1',
            svgHeight,
            chartDimensions: {}
        }),
        data
    )

    const stackedAreaChartObject = addStackedArea(
        getChart({
            id: 'chart2',
            svgHeight,
            margin: {
                left: 64,
                right: 16,
                top: 32,
                bottom: 56
            },
            chartDimensions: {}
        }),
        data
    )

    const updateData = data => {
        return data.map(d => {
            const newWorking = d.working * percentWorking.value / 100
            const newOutOfWorkforce = d.outOfWorkforce * percentOutOfWorkforce.value / 100
            const newNotWorking = d.notWorking + d.working - newWorking + d.outOfWorkforce - newOutOfWorkforce

            return {
                ...d,
                working: newWorking,
                notWorking: newNotWorking,
                outOfWorkforce: newOutOfWorkforce,
                unemploymentRate: newNotWorking / (newWorking + newNotWorking)
            }
        })
    }

    const updateCharts = () => {
        const newData = updateData(data)
        updateLine({ ...lineChartObject, data: newData })
        updateStackedArea({ ...stackedAreaChartObject, data: newData })
    }

    percentWorking.addEventListener('change', () => { updateCharts() })
    percentOutOfWorkforce.addEventListener('change', () => { updateCharts() })
})