import { palette } from "../colours.js"

export const addChart = (chartProps, highlight) => {
    const { chart, width, height } = chartProps

    let piePalette, getTextClass, getPercentText

    if (highlight == 'above') {
        piePalette = ['#737373', palette.bluishGreen]
        getTextClass = d => d.data[0] == 'shareAbove' ? 'font-bold text-7xl' : 'font-normal text-base'
        getPercentText = d => d.data[0] == 'shareAbove' ? `${d.data[1]}%` : ''
    } else {
        piePalette = [palette.vermillion, '#737373']
        getTextClass = d => d.data[0] == 'shareBelow' ? 'font-bold text-4xl' : 'font-normal text-base'
        getPercentText = d => d.data[0] == 'shareBelow' ? `${d.data[1]}%` : ''
    }

    chart.attr('transform', `translate(${[width / 2, height / 2]})`)

    // World data on the year 2022
    const data = { shareBelow: Math.round(8.978049) }
    data.shareAbove = 100 - data.shareBelow

    const pieData = d3
        .pie()
        .value(d => d[1])
        .sort((a, b) => (a, b))
        (Object.entries(data))

    const colour = d3
        .scaleOrdinal()
        .range(piePalette)

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(250)
        .startAngle(d => d.startAngle + Math.PI / 2)
        .endAngle(d => d.endAngle + Math.PI / 2)

    chart
        .selectAll('.my-slices')
        .data(pieData)
        .join('path')
        .attr('d', arc)
        .attr('fill', d => colour(d.data[0]))
        .attr('stroke', 'white')
        .style('stroke-width', '1px')
        .style('opacity', 0.9)

    chart
        .selectAll('.my-slices')
        .data(pieData)
        .join('text')
        .attr('class', getTextClass)
        .attr('fill', 'white')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('transform', d => `translate(${arc.centroid(d).map((d, i) => d * [1.4, 1.25][i])})`)
        .text(getPercentText)
}