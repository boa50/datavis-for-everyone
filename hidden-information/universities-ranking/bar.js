import { addAxis, updateYaxis } from "../../node_modules/visual-components/index.js"
import { palette, defaultColours as colours } from "../../colours.js"

const plotChart = (chartProps, data) => {
    const { chart, width, height } = chartProps
    const dataFiltered = data.slice(0, 10)

    const x = d3
        .scaleLinear()
        .domain([0, 100])
        .range([0, width])

    const y = d3
        .scaleBand()
        .domain(dataFiltered.map(d => d['Institution Name']))
        .range([0, height])
        .padding(.1)

    const colour = d3
        .scaleSequential()
        .domain(d3.extent(dataFiltered, d => d['Overall']))
        .range([d3.hsl(palette.blue).brighter(2), d3.hsl(palette.blue).darker(1)])

    chart
        .selectAll('.data-rect')
        .data(dataFiltered)
        .join('rect')
        .attr('class', 'data-rect')
        .attr('x', x(0))
        .attr('y', d => y(d['Institution Name']))
        .attr('width', d => x(d['Overall']))
        .attr('height', y.bandwidth())
        .attr('fill', d => colour(d['Overall']))

    return { chart, width, height, x, y }
}

export const addChart = (chartProps, data) => {
    const { chart, width, height, x, y } = plotChart(chartProps, data)

    addAxis({
        chart,
        height,
        width,
        colour: colours.axis,
        x,
        y,
        xLabel: 'Overall Score',
        hideXdomain: true,
        hideYdomain: true
    })
}

export const updateChart = (chartProps, data) => {
    const { chart, y } = plotChart(chartProps, data)

    updateYaxis({
        chart,
        y,
        hideDomain: true
    })
}