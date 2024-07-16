import { getChart, getMargin, getChartDimensions, appendChartContainer } from "../node_modules/visual-components/index.js"
import { addChart as addColumn } from "./charts/column.js"

const getDataGroup = i =>
    i <= 3030 ? 'grp1' :
        i <= 6060 ? 'grp2' : 'grp3'


const getData = () =>
    d3.csv("../_data/gov-spending.csv")
        .then(d => d.sort(() => Math.random() - 0.5).map((v, i) => { return { ...v, govSpending: +v.govSpending, group: getDataGroup(i) } }))

const columnId = appendChartContainer({ idNum: 1, chartTitle: 'Column' })
const columnErrorId = appendChartContainer({ idNum: 2, chartTitle: 'Column with error line' })
appendChartContainer({ idNum: 3, chartTitle: 'Boxplot' })
appendChartContainer({ idNum: 4, chartTitle: 'Violin' })
appendChartContainer({ idNum: 5, chartTitle: 'Strip plot (Scatter)' })
appendChartContainer({ idNum: 6, chartTitle: 'Jitter plot' })

getData().then(data => {
    addColumn(
        getChart({
            id: columnId,
            chartDimensions: getChartDimensions({ chartId: columnId })
        }),
        data
    )

    addColumn(
        getChart({
            id: columnErrorId,
            chartDimensions: getChartDimensions({ chartId: columnErrorId })
        }),
        data,
        true
    )
})