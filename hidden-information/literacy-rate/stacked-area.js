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
        .attr('font-size', width > 400 ? '2.5rem' : '1.25rem')
        .attr('fill', '#171717')
        .attr('font-weight', 500)
        .attr('dominant-baseline', 'middle')
        .attr('opacity', 0.45)
        .text('Literacy Rate')

    const simplifiedData = data.filter(d => ['1900', '1960', '2022'].includes(d.year))
    const tooltipColour = d3.hsl(palette.bluishGreen).darker(2)

    chart
        .selectAll('.data-point-simplified')
        .data(simplifiedData)
        .join('circle')
        .attr('cx', d => x(d.year))
        .attr('cy', d => y(d.literacyRate))
        .attr('r', 5)
        .attr('fill', tooltipColour)

    chart
        .selectAll('.data-point-simplified-text')
        .data(simplifiedData)
        .join('text')
        .attr('x', d => x(d.year) + (d.year === '1900' ? 5 : -5))
        .attr('y', d => y(d.literacyRate + 2))
        .attr('font-size', '0.8rem')
        .attr('text-anchor', d => d.year === '1900' ? 'start' : 'end')
        .attr('fill', tooltipColour)
        .text(d => d3.format('.1%')(d.literacyRate / 100))

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
            <span>${d3.format('.1%')(d.literacyRate / 100)}</span>
        </div>
        `,
        colour: tooltipColour,
        data,
        cx: d => x(d.year),
        cy: d => y(d.literacyRate),
        radius: 5,
        chartWidth: width,
        chartHeight: height
    })
}