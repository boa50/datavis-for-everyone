import { appendBar, updateBar, highlightBarColour, defaultBarColour } from "./bar.js"
import { plotAxis, updateAxis, appendFlag, appendRanking, showRanking, hideRanking, appendCountryName } from "./axis.js"
import { createChartContainer } from "../utils.js"
import { getBarTransition } from "./transition.js"

export const addChart = async ({ svg, width, height, xPosition, yPosition }) => {
    const chart = createChartContainer('bar-chart', svg, xPosition, yPosition)
    const data = await d3.csv('./data/dataset.csv')
        .then(dt => dt
            .map(d => {
                return {
                    ...d,
                    homicideRate: +d.homicideRate,
                    homicideNumber: +d.homicideNumber
                }
            })
            .sort((a, b) => b.homicideNumber - a.homicideNumber)
            .map((d, i) => {
                return {
                    ...d,
                    homicideNumberRank: i + 1
                }
            })
        )

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
        showRanking: () => showRanking(chartProps.chart),
        hideRanking: () => hideRanking(chartProps.chart),
        highlightBarColour: () => highlightBarColour(chartProps.chart),
        defaultBarColour: () => defaultBarColour(chartProps.chart),
        clearChart: () => clearChart(chartProps.chart)
    }
}

const dataGroupClass = '.data-group'

function plotChart(chartProps, metric, isInitialPlot = false) {
    const { chart, x, y, height, width, data } = chartProps

    // Check for on course transitions
    const chartNodes = chart.selectAll(dataGroupClass).nodes()
    if (chartNodes.length > 0 &&
        d3.active(chartNodes[0], 'bar')) return

    const chartData = data.sort((a, b) => b[metric] - a[metric]).slice(0, 20)

    x.domain([0, d3.max(chartData, d => d[metric]) * 1.05])
    y.domain(chartData.map(d => d.country))

    const flagWidth = y.bandwidth() * 1.6
    const yOutOfBounds = height * 2

    chart
        .selectAll(dataGroupClass)
        .data(chartData, d => d.country)
        .join(
            enter => enter
                .append('g')
                .attr('class', dataGroupClass.slice(1))
                .call(g => appendBar(g, x, y, metric))
                .call(g => appendFlag(g, x, y, flagWidth))
                .call(g => appendRanking(g, x, y, flagWidth))
                .call(g => appendCountryName(g, x, y))
                .attr('transform', `translate(0, ${yOutOfBounds})`)
                .transition(getBarTransition())
                .attr('transform', d => `translate(0, ${y(d.country)})`),
            update => update
                .call(g => updateBar(g, x, metric))
                .transition(getBarTransition())
                .attr('transform', d => `translate(0, ${y(d.country)})`),
            exit => exit
                .transition(getBarTransition())
                .remove()
                .attr('transform', `translate(0, ${yOutOfBounds})`)
        )

    const xLabel = metric === 'homicideNumber' ? 'Number of Homicides' : 'Homicide Rate (per 100 000 inhabitants)'

    if (isInitialPlot) plotAxis(chart, x, height, width, xLabel)
    else updateAxis(chart, x, xLabel)
}

function clearChart(chart) {
    chart
        .selectAll(dataGroupClass)
        .transition(getBarTransition())
        .remove()
        .attr('transform', `translate(0, ${2000})`)
    chart.select('.x-axis-group').remove()
    chart.select('.y-axis-group').remove()
}