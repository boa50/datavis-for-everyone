import { palette } from "../../colours.js"

export const addChart = (chartProps, data) => {
    const { chart, width, height } = chartProps

    const dataGrouped = d3.flatRollup(data, D => D.length, d => d.latitude_grp, d => d.longitude_grp)

    console.log(dataGrouped);

    const x = d3
        .scaleBand()
        .domain(getGroups(data, 'longitude_grp'))
        .range([0, width])
        .padding(0.05)

    const y = d3
        .scaleBand()
        .domain(getGroups(data, 'latitude_grp'))
        .range([height, 0])
        .padding(0.05)

    const colour = d3
        .scaleLinear()
        .range(['transparent', d3.hsl(palette.blue).darker(0.5)])
        .domain([0, d3.max(dataGrouped, d => d[2])])

    chart
        .selectAll('.data-point')
        .data(dataGrouped)
        .join('rect')
        .attr('class', 'data-point')
        .attr('x', d => x(d[1]))
        .attr('y', d => y(d[0]))
        .attr('width', x.bandwidth())
        .attr('height', y.bandwidth())
        .attr('rx', 4)
        .attr('ry', 4)
        .style('fill', d => colour(d[2]))

    // Tooltip
    // chart
    //     .selectAll('.tooltip-point')
    //     .data(dataGrouped)
    //     .join('rect')
    //     .attr('class', 'tooltip-point')
    //     .attr('x', d => x(d.X_VARIABLE))
    //     .attr('y', d => y(d.Y_VARIABLE))
    //     .attr('width', x.bandwidth())
    //     .attr('height', y.bandwidth())
    //     .attr('rx', 4)
    //     .attr('ry', 4)
    //     .attr('stroke-width', 4)
    //     .attr('stroke', COLOUR_TOOLTIP)
    //     .attr('opacity', 0)
    //     .style('fill', 'transparent')
}

function getGroups(data, field) {
    return [...new Set(data.map(d => d[field]).sort((a, b) => a - b))]
}