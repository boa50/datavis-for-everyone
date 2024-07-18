import { getChart, getMargin, appendChartContainer } from "../node_modules/visual-components/index.js"
import { addChart as addColumn } from "./charts/column.js"
import { addChart as addBoxplot } from "./charts/boxplot.js"
import { addChart as addViolin } from "./charts/violin.js"
import { addChart as addScatter } from "./charts/scatter.js"

const theme = 'light'

const getDataGroup = i =>
    i <= 3030 ? 'grp1' :
        i <= 6060 ? 'grp2' : 'grp3'


const getData = () =>
    d3.csv("../_data/gov-spending.csv")
        .then(d => d
            .sort(() => Math.random() - 0.5)
            .map((v, i) => {
                return {
                    ...v,
                    govSpending: +v.govSpending,
                    group: getDataGroup(i)
                }
            }))

const columnId = appendChartContainer({ idNum: 1, chartTitle: 'Column', theme })
const columnErrorId = appendChartContainer({ idNum: 2, chartTitle: 'Column with error line', theme })
const boxplotId = appendChartContainer({ idNum: 3, chartTitle: 'Boxplot', theme })
const violinId = appendChartContainer({ idNum: 4, chartTitle: 'Violin', theme })
const stripId = appendChartContainer({ idNum: 5, chartTitle: 'Strip plot', theme })
const jitterId = appendChartContainer({ idNum: 6, chartTitle: 'Jitter plot', theme })

getData().then(data => {
    const groups = [...new Set(data.map(d => d.group))]

    data = getSubgroup(data, 'grp1')
        .concat(getSubgroup(data, 'grp2'))
        .concat(getSubgroup(data, 'grp3'))

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

    const chartMargin = getMargin({ left: 32, bottom: 32 })

    addColumn(
        getChart({ id: columnId, margin: chartMargin }),
        dataGrouped, theme
    )

    addColumn(
        getChart({ id: columnErrorId, margin: chartMargin }),
        dataGrouped, theme, true
    )

    addBoxplot(
        getChart({ id: boxplotId, margin: chartMargin }),
        dataGrouped, theme
    )

    addViolin(
        getChart({ id: violinId, margin: chartMargin }),
        data, theme
    )

    addScatter(
        getChart({ id: stripId, margin: chartMargin }),
        data, theme
    )

    addScatter(
        getChart({ id: jitterId, margin: chartMargin }),
        data, theme, true
    )
})

function getSubgroup(data, group, size = 250) {
    return data
        .filter(d => d.group === group)
        .sort(() => Math.random() - 0.5)
        .slice(0, size)
}