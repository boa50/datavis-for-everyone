import { addAxis } from "../../node_modules/visual-components/index.js"
import { palette } from "../../colours.js"

export const addChart = (chartProps, data) => {
    const { chart, width, height } = chartProps
    const lineColours = Object.values(palette)
    const axesColour = palette.axis

    const x = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, width])

    const y = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.average).map((d, i) => d * [0.98, 1.01][i]))
        .range([height, 0])

    const dataPerGroup = d3.group(data, d => d.country)
    const colour = d3
        .scaleOrdinal()
        .range(lineColours)

    const line = d3
        .line()
        .x(d => x(d.year))
        .y(d => y(d.average))

    chart
        .selectAll('.data-line')
        .data(dataPerGroup)
        .join('path')
        .attr('fill', 'none')
        .attr('stroke', d => colour(d[0]))
        .attr('stroke-width', 1)
        .attr('d', d => line(d[1]))

    addAxis({
        chart,
        height,
        width,
        colour: axesColour,
        x,
        y,
        xLabel: 'Year',
        yLabel: 'Average life expectancy',
        xFormat: d => d,
        xNumTicks: 5,
        yTickValues: [76, 78, 80, 82, 84],
        hideXdomain: false,
        hideYdomain: true
    })
}