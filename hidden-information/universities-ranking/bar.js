import { addAxis } from "../../node_modules/visual-components/index.js"
import { palette, defaultColours as colours } from "../../colours.js"

export const addChart = (chartProps, data) => {
    const { chart, width, height } = chartProps

    const dataFiltered = data.slice(0, 10)

    const x = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d['Overall'])])
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
        .attr('x', x(0))
        .attr('y', d => y(d['Institution Name']))
        .attr('width', d => x(d['Overall']))
        .attr('height', y.bandwidth())
        .attr('fill', d => colour(d['Overall']))

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