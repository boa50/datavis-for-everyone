import { colours } from "../constants.js"
import { addAxis } from "../../../components/axis/script.js"
import { addLineTooltip as addTooltip } from "../../../components/tooltip/script.js"
import { formatDate } from "../../../components/utils.js"

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
        yFormat: d3.format('.0%'),
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
        .attr('stroke', colours.line)
        .attr('stroke-width', 3)
        .attr('d', d => line(d))

    addTooltip(
        'charts',
        d => `
        <strong>${formatDate(d.measureDate)}</strong>
        <div style="display: flex; justify-content: space-between">
            <span>Unemployment Rate:&emsp;</span>
            <span>${d3.format('.2%')(d.unemploymentRate)}</span>
        </div>
        `,
        colours.line,
        {
            chart,
            data,
            cx: d => x(d.measureDate),
            cy: d => y(d.unemploymentRate),
            radius: 4
        }
    )
}