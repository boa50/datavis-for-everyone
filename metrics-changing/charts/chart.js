import { colours } from "../../../node_modules/visual-components/index.js"
import { createChartContainer } from "../utils.js"

export const addChart = async ({ svg, width, height, xPosition, yPosition }) => {
    const chart = createChartContainer('bar-chart', svg, xPosition, yPosition)
    const data = await d3.csv('./data/dataset.csv')
        .then(dt => dt.map(d => {
            return {
                ...d,
                homicideRate: +d.homicideRate,
                homicideNumber: +d.homicideNumber
            }
        }))

    const x = d3
        .scaleLinear()
        .range([0, width])

    const y = d3
        .scaleBand()
        .range([0, height])
        .padding(.1)

    const chartProps = { chart, x, y, data }

    // plotChart(chartProps, 'homicideNumber')

    return chartProps
}

function plotChart(chartProps, metric) {
    const { chart, x, y, data } = chartProps

    // Check for on course transitions
    const chartNodes = chart.selectAll('.data-point').nodes()
    if (chartNodes.length > 0 &&
        d3.active(chartNodes[0], 'plotChart')) return

    const chartData = data.sort((a, b) => b[metric] - a[metric]).slice(0, 10)

    x.domain([0, d3.max(chartData, d => d[metric]) * 1.05])
    y.domain(chartData.map(d => d.country))

    chart
        .selectAll('.data-point')
        .data(chartData)
        .join('rect')
        .attr('class', 'data-point')
        .attr('height', y.bandwidth())
        .attr('fill', colours.paletteLightBg.blue)
        .transition('plotChart')
        .attr('x', x(0))
        .attr('y', d => y(d.country))
        .attr('width', d => x(d[metric]))
}


const clearChart = chart => {
    chart.selectAll('rect').remove()
}

export const updateChartFunctions = chartProps => {
    return {
        plotHomicideNumber: () => plotChart(chartProps, 'homicideNumber'),
        plotHomicideRate: () => plotChart(chartProps, 'homicideRate'),
        clearChart: () => clearChart(chartProps.chart)
    }
}