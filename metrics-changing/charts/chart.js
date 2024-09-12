import { colours, addAxis, updateXaxis, updateYaxis } from "../../../node_modules/visual-components/index.js"
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
                .call(g => g
                    .selectAll('rect')
                    .transition(transition)
                    .attr('width', d => x(d[metric]))
                )
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

function appendBar(g, x, y, metric, transition) {
    g
        .append('rect')
        .attr('height', y.bandwidth())
        .attr('x', x(0))
        .attr('y', 0)
        .attr('fill', d => d.country === 'Brazil' ? colours.paletteLightBg.bluishGreen : colours.paletteLightBg.blue)
        .transition(transition)
        .attr('width', d => x(d[metric]))
}

function appendFlag(g, x, y, flagWidth) {
    g
        .append('image')
        .attr('class', 'country-flag')
        .attr('width', flagWidth)
        .attr('height', y.bandwidth())
        .attr('x', x(0) - flagWidth - 4)
        .attr('y', 0)
        .attr('preserveAspectRatio', 'none')
        .attr('xlink:href', d => `/_data/img/country-flags/${d.code}.webp`)
}

const xFormat = d3.format('.2s')

function plotAxis(chart, x, y, height, width, xLabel) {
    addAxis({
        chart,
        height,
        width,
        colour: colours.paletteLightBg.axis,
        x,
        // y,
        xFormat,
        xLabel,
        hideXdomain: true,
        // hideYdomain: true
    })
}

function updateAxis(chart, x, y, xLabel) {
    updateXaxis({
        chart,
        x,
        format: xFormat,
        hideDomain: true,
        label: xLabel
    })

    // updateYaxis({
    //     chart,
    //     y,
    //     hideDomain: true
    // })
}

function clearChart(chart) {
    chart.selectAll('rect').remove()
    chart.select('.x-axis-group').remove()
    chart.select('.y-axis-group').remove()
}