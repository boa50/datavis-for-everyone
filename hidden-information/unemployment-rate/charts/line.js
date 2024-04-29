import { addAxis } from "../../../components/axis/script.js"
import { colours } from "../constants.js"

export const plotChart = (chartProps, data) => {
    const { chart, width, height } = chartProps

    const x = d3
        .scaleTime()
        .domain(d3.extent(data, d => d.measureDate))
        .range([0, width])

    const y = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.unemploymentRate).map((d, i) => d * [0, 1.2][i]))
        .range([height, 0])

    addAxis({
        chart,
        height,
        width,
        x,
        y,
        xLabel: 'Year',
        yLabel: 'Unemployment rate',
        yFormat: d => d3.format('.0%')(d / 100),
        colour: colours.axis,
        hideYdomain: true
    })

    const line = d3
        .line()
        .x(d => x(d.measureDate))
        .y(d => y(d.unemploymentRate))

    chart
        .append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#000000')
        .attr('stroke-width', 1)
        .attr('d', d => line(d))
}