import { addAxis } from "../../node_modules/visual-components/index.js"
import { palette, paletteDarkBg } from "../../colours.js"

export const addChart = (chartProps, data, theme = 'light') => {
    const { chart, width, height } = chartProps
    let circleColour, axesColour

    switch (theme) {
        case 'light':
            circleColour = palette.blue
            axesColour = palette.axis
            break
        case 'strongDark':
            circleColour = '#FFFFFF'
            axesColour = d3.hsl('#FFFFFF').darker(0.2)
            break
        case 'softDark':
            circleColour = paletteDarkBg.blue
            axesColour = paletteDarkBg.axis
            break
        default:
            circleColour = palette.blue
            axesColour = palette.axis
            break
    }

    const x = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.male).map((d, i) => d * [0.95, 1.05][i]))
        .range([0, width])

    const y = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.female).map((d, i) => d * [0.95, 1.05][i]))
        .range([height, 0])

    chart
        .selectAll('.data-points')
        .data(data)
        .join('circle')
        .attr('class', 'data-points')
        .attr('r', 5)
        .attr('fill', circleColour)
        .style('opacity', 0.75)
        .attr('stroke', '#6b7280')
        .attr('stroke-width', 0.5)
        .transition()
        .attr('cx', d => x(d.male))
        .attr('cy', d => y(d.female))

    addAxis({
        chart,
        height,
        width,
        colour: axesColour,
        x,
        y,
        xLabel: 'Men life expectancy',
        yLabel: 'Women life expectancy',
        yNumTicks: 5,
        xNumTicks: 5
    })
}