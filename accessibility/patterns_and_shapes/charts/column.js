import { addAxis, addLegend } from "../../../node_modules/visual-components/index.js"
import { palette, defaultColours } from "../../../colours.js"

export const addChart = (chartProps, data) => {
    const { chart, width, height, margin } = chartProps

    const energySources = [...new Set(data.map(d => d.source))]
    const colourPalette = [palette.bluishGreen, palette.blue, palette.orange, palette.reddishPurple]

    const x = d3
        .scaleBand()
        .domain(data.map(d => d.year))
        .range([0, width])
        .padding(.15)

    const xSubgroup = d3
        .scaleBand()
        .domain(energySources)
        .range([0, x.bandwidth()])
        .padding(.1)

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.generation) * 1.2])
        .range([height, 0])

    const colour = d3
        .scaleOrdinal()
        .range(colourPalette)
        .domain(energySources)

    chart
        .selectAll('.data-point')
        .data(data)
        .join('rect')
        .attr('class', 'data-point')
        .attr('transform', d => `translate(${x(d.year)}, 0)`)
        .attr('x', d => xSubgroup(d.source))
        .attr('y', d => y(d.generation))
        .attr('width', xSubgroup.bandwidth())
        .attr('height', d => height - y(d.generation))
        .attr('fill', d => colour(d.source))

    addAxis({
        chart,
        height,
        width,
        colour: defaultColours.axis,
        x,
        y,
        xLabel: 'Year',
        yLabel: 'Generation (TWh)',
        yTickValues: [0, 1000, 2000, 3000, 4000, 5000],
        hideXdomain: true,
        hideYdomain: true
    })

    addLegend({
        chart,
        legends: energySources,
        colours: colourPalette,
        xPosition: -margin.left
    })
}

