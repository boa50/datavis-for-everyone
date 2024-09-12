import { appendBar, updateBar } from "./bar.js"
import { appendFlag } from "./flag.js"
import { plotAxis, updateAxis } from "./axis.js"
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

    const chartProps = { chart, x, y, height, width, data }

    return chartProps
}

export const updateChartFunctions = chartProps => {
    return {
        plotInitial: () => plotChart(chartProps, 'homicideNumber', true),
        plotHomicideNumber: () => plotChart(chartProps, 'homicideNumber'),
        plotHomicideRate: () => plotChart(chartProps, 'homicideRate'),
        clearChart: () => clearChart(chartProps.chart)
    }
}

function plotChart(chartProps, metric, isInitialPlot = false) {
    const { chart, x, y, height, width, data } = chartProps

    // Check for on course transitions
    const chartNodes = chart.selectAll('.data-point').nodes()
    if (chartNodes.length > 0 &&
        d3.active(chartNodes[0], 'plotChart')) return

    const chartData = data.sort((a, b) => b[metric] - a[metric]).slice(0, 20)

    x.domain([0, d3.max(chartData, d => d[metric]) * 1.05])
    y.domain(chartData.map(d => d.country))

    const flagWidth = y.bandwidth() * 1.6
    const yOutOfBounds = height * 2
    const transition = d3
        .transition('plotChart')
        .duration(isInitialPlot ? 500 : 1000)

    chart
        .selectAll('.data-point')
        .data(chartData, d => d.country)
        .join(
            enter => enter
                .append('g')
                .attr('class', 'data-point')
                .call(g => appendBar(g, x, y, metric, transition))
                .call(g => appendFlag(g, x, y, flagWidth))
                .attr('transform', `translate(0, ${yOutOfBounds})`)
                .transition(transition)
                .attr('transform', d => `translate(0, ${y(d.country)})`),
            update => update
                .call(g => updateBar(g, x, metric, transition))
                .transition(transition)
                .attr('transform', d => `translate(0, ${y(d.country)})`),
            exit => exit
                .transition(transition)
                .remove()
                .attr('transform', d => `translate(0, ${yOutOfBounds})`)
        )

    if (isInitialPlot) plotAxis(chart, x, y, height, width, metric)
    else updateAxis(chart, x, y, metric)
}

function clearChart(chart) {
    chart.selectAll('rect').remove()
    chart.select('.x-axis-group').remove()
    chart.select('.y-axis-group').remove()
}