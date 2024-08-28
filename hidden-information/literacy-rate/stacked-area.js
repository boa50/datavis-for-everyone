import { addAxis, addLineTooltip } from '../../node_modules/visual-components/index.js'
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

    chart
        .append('text')
        .attr('x', width / 1.7)
        .attr('y', y(25))
        .attr('font-size', '2.5rem')
        .attr('fill', '#171717')
        .attr('font-weight', 500)
        .attr('dominant-baseline', 'middle')
        .attr('opacity', 0.45)
        .text('Literacy Rate')

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

    addLineTooltip({
        chart,
        htmlText: d => `
        <strong>${d.year}</strong>
        <div style="display: flex; justify-content: space-between">
            <span>Literacy Rate:&emsp;</span>
            <span>${d3.format('.2%')(d.literacyRate / 100)}</span>
        </div>
        `,
        colour: d3.hsl(palette.bluishGreen).darker(2),
        data,
        cx: d => x(d.year),
        cy: d => y(d.literacyRate),
        radius: 5,
        chartWidth: width,
        chartHeight: height
    })
}