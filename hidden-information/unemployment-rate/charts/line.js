import { colours } from "../constants.js"
import { addAxis, updateYaxis } from "../../../components/axis/script.js"
import { addLineTooltip as addTooltip, removeLineTooltip as removeTooltip } from "../../../components/tooltip/script.js"
import { formatDate } from "../../../components/utils.js"

const getYscale = (data, height) =>
    d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.unemploymentRate).map((d, i) => d * [0, 1.2][i]))
        .range([height, 0])

export const updateChart = ({ chart, data, x, height }) => {
    removeTooltip(chart)
    d3.select('#chart1-container').select('.tooltip').remove()

    const y = getYscale(data, height)
    const line = d3
        .line()
        .x(d => x(d.measureDate))
        .y(d => y(d.unemploymentRate))

    chart
        .selectAll('.line-path')
        .data([data])
        .join('path')
        .attr('class', 'line-path')
        .attr('fill', 'none')
        .attr('stroke', colours.line)
        .attr('stroke-width', 3)
        .transition()
        .attr('d', line)

    addTooltip(
        'chart1-container',
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

    updateYaxis({
        chart,
        y,
        format: d3.format('.0%'),
        hideDomain: true
    })
}

export const addChart = (chartProps, data) => {
    const { chart, width, height } = chartProps

    const x = d3
        .scaleTime()
        .domain(d3.extent(data, d => d.measureDate))
        .range([0, width])

    const y = getYscale(data, height)

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

    const chartObject = { chart, data, x, height }

    updateChart(chartObject)

    return chartObject
}