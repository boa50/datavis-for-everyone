import { addAxis } from "../../node_modules/visual-components/index.js"
import { palette } from "../../colours.js"

export const addChart = (chartProps, data, theme = 'light') => {
    const { chart, width, height } = chartProps
    const defaultColours = [palette.vermillion, palette.blue, palette.amber]
    let lineColours, axesColour

    switch (theme) {
        case 'light':
            lineColours = defaultColours
            axesColour = palette.axis
            break
        case 'strongDark':
            lineColours = defaultColours.map(c => d3.hsl(c).brighter(1))
            axesColour = d3.hsl('#FFFFFF').darker(0.2)
            break
        case 'softDark':
            lineColours = ['#FFB276', '#60A3D9', '#F9E07A']
            axesColour = '#d4d4d4'
            break
        default:
            lineColours = defaultColours
            axesColour = palette.axis
            break
    }

    const x = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, width])

    const y = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.average).map((d, i) => d * [0.98, 1.01][i]))
        .range([height, 0])

    const dataPerGroup = d3.group(data, d => d.country)
    const colour = d3
        .scaleOrdinal()
        .range(lineColours)

    const line = d3
        .line()
        .x(d => x(d.year))
        .y(d => y(d.average))
        .curve(d3.curveCatmullRom)

    chart
        .selectAll('.data-line')
        .data(dataPerGroup)
        .join('path')
        .attr('fill', 'none')
        .attr('stroke', d => colour(d[0]))
        .attr('stroke-width', 3)
        .attr('d', d => line(d[1]))

    addAxis({
        chart,
        height,
        width,
        colour: axesColour,
        x,
        y,
        xLabel: 'Year',
        yLabel: 'Average life expectancy',
        xFormat: d => d,
        xNumTicks: 5,
        yTickValues: [76, 78, 80, 82, 84],
        hideXdomain: false,
        hideYdomain: true
    })
}