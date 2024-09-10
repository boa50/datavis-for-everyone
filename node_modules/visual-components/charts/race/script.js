import { prepareRaceData } from "./data.js"
import { createAreaChart, updateAreaChart } from "./area.js"
import { createLineChart, updateLineChart } from "./line.js"

export const runRaceChart = ({
    type,
    chart,
    data,
    dateField = undefined,
    yearField = undefined,
    isRankedData = false,
    splitsPerStep = 50,
    nRanks = 10,
    x,
    y,
    updateAxis,
    customAttrs,
    addCustom = () => { }
}) => {
    const { keyframes, groups } = prepareRaceData({
        data,
        dateField,
        yearField,
        isRankedData,
        k: splitsPerStep,
        n: nRanks
    })

    let createChart, updateChart
    switch (type) {
        case 'line':
            createChart = createLineChart
            updateChart = updateLineChart
            break;
        case 'area':
            createChart = createAreaChart
            updateChart = updateAreaChart
            break;
    }

    const runChart = async () => {
        const updateChartProps = createChart(chart, x, y, customAttrs)

        for (let i = 1; i < keyframes.length; i++) {
            const keyframeData = []
            keyframes.slice(0, i)
                .forEach(d => d[1].forEach(v => { keyframeData.push({ date: d[0], group: v.group, value: v.value }) }))

            let currentData = keyframeData
            switch (type) {
                case 'area':
                    currentData = d3
                        .stack()
                        .offset(d3.stackOffsetDiverging)
                        .keys(groups)
                        .value(([, group], key) => group.get(key).value)
                        (d3.index(keyframeData, d => d.date, d => d.group))
                    break;
            }

            const transition = chart
                .transition()
                .duration(0)
                .ease(d3.easeLinear)

            updateChart(updateChartProps, currentData, updateAxis, x, y)

            addCustom(keyframeData, x, y)

            await transition.end()
        }
    }

    runChart()
}