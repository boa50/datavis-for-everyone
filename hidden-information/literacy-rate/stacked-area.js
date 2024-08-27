import { addAxis } from '../../node_modules/visual-components/index.js'
import { palette } from '../../colours.js'

export const addChart = (chartProps, data) => {
    const { chart, width, height } = chartProps

    const x = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, width])

    const y = d3
        .scaleLinear()
        .domain([0, 100])
        .range([height, 0])

    const area = d3
        .area()
        .x(d => x(d.year))
        .y0(y(0))
        .y1(d => y(d.literacyRate))

    chart
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height)
        .attr('fill', d3.hsl(palette.axis).brighter(2.7))

    chart
        .selectAll('.data-area')
        .data([data])
        .join('path')
        .attr('fill', palette.bluishGreen)
        .attr('d', area)

    addAxis({
        chart,
        height,
        width,
        colour: palette.axis,
        x,
        y,
        xLabel: 'Year',
        yLabel: 'Literacy Rate',
        xFormat: d => d,
        yFormat: d => d3.format('.0%')(d / 100),
        hideXdomain: true,
        hideYdomain: true,
        xNumTicks: 7,
        xNumTicksForceInitial: true,
        yNumTicks: 5,
        yNumTicksForceInitial: true
    })
}