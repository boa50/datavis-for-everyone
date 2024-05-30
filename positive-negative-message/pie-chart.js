import { palette } from "../colours.js"

export const addChart = chartProps => {
    const { chart, width, height } = chartProps

    const highlight = 'above'
    let piePalette, getTextClass

    if (highlight == 'above') {
        piePalette = ['#737373', palette.bluishGreen]
        getTextClass = d => d.data[0] == 'shareAbove' ? 'font-bold text-7xl' : 'font-normal text-base'
    } else {
        piePalette = ['#737373', palette.bluishGreen].reverse()
        getTextClass = d => d.data[0] == 'shareBelow' ? 'font-bold text-4xl' : 'font-normal text-base'
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
        .text(d => `${d.data[1]}%`)
}