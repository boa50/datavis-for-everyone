import { getChart, getChartDimensions, appendChartContainer } from "../node_modules/visual-components/index.js"
import { addChart as addColumn } from "./charts/column.js"
import { addChart as addBoxplot } from "./charts/boxplot.js"
import { addChart as addViolin } from "./charts/violin.js"

const getDataGroup = i =>
    i <= 3030 ? 'grp1' :
        i <= 6060 ? 'grp2' : 'grp3'


const getData = () =>
    d3.csv("../_data/gov-spending.csv")
        .then(d => d.sort(() => Math.random() - 0.5).map((v, i) => { return { ...v, govSpending: +v.govSpending, group: getDataGroup(i) } }))

const columnId = appendChartContainer({ idNum: 1, chartTitle: 'Column' })
const columnErrorId = appendChartContainer({ idNum: 2, chartTitle: 'Column with error line' })
const boxplotId = appendChartContainer({ idNum: 3, chartTitle: 'Boxplot' })
const violinId = appendChartContainer({ idNum: 4, chartTitle: 'Violin' })
appendChartContainer({ idNum: 5, chartTitle: 'Strip plot (Scatter)' })
appendChartContainer({ idNum: 6, chartTitle: 'Jitter plot' })

getData().then(data => {
    const groups = [...new Set(data.map(d => d.group))]

    const dataGrouped = groups.map(grp => {
        const dataFiltered = data.filter(d => d.group === grp)
        const govSpendings = dataFiltered.map(d => d.govSpending)
        const q1 = d3.quantile(govSpendings, 0.25)
        const q3 = d3.quantile(govSpendings, 0.75)
        const iqr = q3 - q1

        return {
            group: grp,
            average: dataFiltered.reduce((t, c) => t + c.govSpending, 0) / dataFiltered.length,
            q1: q1,
            median: d3.quantile(govSpendings, 0.5),
            q3: q3,
            iqr: iqr,
            min: Math.max(q1 - iqr * 1.5, 0),
            max: Math.min(q3 + iqr * 1.5, 100)
        }
    })

    addColumn(
        getChart({
            id: columnId,
            chartDimensions: getChartDimensions({ chartId: columnId })
        }),
        dataGrouped
    )

    addColumn(
        getChart({
            id: columnErrorId,
            chartDimensions: getChartDimensions({ chartId: columnErrorId })
        }),
        dataGrouped,
        true
    )

    addBoxplot(
        getChart({
            id: boxplotId,
            chartDimensions: getChartDimensions({ chartId: boxplotId })
        }),
        dataGrouped
    )

    addViolin(
        getChart({
            id: violinId,
            chartDimensions: getChartDimensions({ chartId: violinId })
        }),
        data
    )
})