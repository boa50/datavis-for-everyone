import { addAxis } from "../../node_modules/visual-components/index.js"
import { palette, paletteDarkBg } from "../../colours.js"

export const addChart = (chartProps, data, theme = 'light') => {
    const { chart, width, height } = chartProps
    let barColour, axesColour

    switch (theme) {
        case 'light':
            barColour = palette.blue
            axesColour = palette.axis
            break
        case 'strongDark':
            barColour = '#FFFFFF'
            axesColour = d3.hsl('#FFFFFF').darker(0.2)
            break
        case 'softDark':
            barColour = paletteDarkBg.blue
            axesColour = paletteDarkBg.axis
            break
        default:
            barColour = palette.blue
            axesColour = palette.axis
            break
    }

    const x = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.average) * 1.05])
        .range([0, width])

    const y = d3
        .scaleBand()
        .domain(data.map(d => d.country))
        .range([0, height])
        .padding(.25)

    chart
        .selectAll('.myRect')
        .data(data)
        .join('rect')
        .attr('x', x(0))
        .attr('y', d => y(d.country))
        .attr('width', d => x(d.average))
        .attr('height', y.bandwidth())
        .attr('fill', barColour)

    addAxis({
        chart,
        height,
        width,
        colour: axesColour,
        x,
        y,
        xLabel: 'Average life expectancy',
        yLabel: 'Country',
        hideXdomain: true,
        hideYdomain: true,
        xTickValues: [0, 20, 40, 60, 80]
    })
}