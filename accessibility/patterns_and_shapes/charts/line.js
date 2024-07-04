import { addAxis, addLegend } from "../../../node_modules/visual-components/index.js"
import { palette, defaultColours } from "../../../colours.js"

export const addChart = (chartProps, data) => {
    const { chart, width, height, margin } = chartProps

    const energySources = [...new Set(data.map(d => d.source))]
    const colourPalette = [palette.bluishGreen, palette.blue, palette.orange, palette.reddishPurple]

    const x = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, width])

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.generation) * 1.2])
        .range([height, 0])

    const dataPerGroup = d3.group(data, d => d.source)
    const colour = d3
        .scaleOrdinal()
        .range(colourPalette)
        .domain(energySources)

    const line = d3
        .line()
        .x(d => x(d.year))
        .y(d => y(d.generation))

    chart
        .selectAll('.data-line')
        .data(dataPerGroup)
        .join('path')
        .attr('fill', 'none')
        .attr('stroke', d => colour(d[0]))
        .attr('stroke-width', 5)
        .attr('d', d => line(d[1]))

    addLegend({
        chart,
        legends: energySources,
        colours: colourPalette,
        xPosition: -margin.left
    })

    addAxis({
        chart,
        height,
        width,
        colour: defaultColours.axis,
        x,
        y,
        xLabel: 'Year',
        yLabel: 'Generation (TWh)',
        xFormat: d => d,
        xNumTicks: 5,
        xNumTicksForceInitial: true,
        yTickValues: [0, 1000, 2000, 3000, 4000, 5000],
        hideXdomain: true,
        hideYdomain: true
    })
}