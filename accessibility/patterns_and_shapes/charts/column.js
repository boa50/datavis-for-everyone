import { addAxis, addLegend } from "../../../node_modules/visual-components/index.js"
import { palette, defaultColours } from "../../../colours.js"

export const addChart = (chartProps, data, pattern = false) => {
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

    if (pattern) {
        chart
            .append('defs')
            .append('pattern')
            .attr('id', 'diagonalHatch')
            .attr('patternUnits', 'userSpaceOnUse')
            .attr('width', 4)
            .attr('height', 4)
            .append('path')
            .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
            .attr('stroke', '#000000')
            .attr('stroke-width', 1)

        chart
            .append('defs')
            .append('pattern')
            .attr('id', 'wavesPattern')
            .attr('patternUnits', 'userSpaceOnUse')
            .attr('width', 70)
            .attr('height', 8)
            .append('path')
            .attr('d', 'M-.02 22c8.373 0 11.938-4.695 16.32-9.662C20.785 7.258 25.728 2 35 2c9.272 0 14.215 5.258 18.7 10.338C58.082 17.305 61.647 22 70.02 22M-.02 14.002C8.353 14 11.918 9.306 16.3 4.339 20.785-.742 25.728-6 35-6 44.272-6 49.215-.742 53.7 4.339c4.382 4.967 7.947 9.661 16.32 9.664M70 6.004c-8.373-.001-11.918-4.698-16.3-9.665C49.215-8.742 44.272-14 35-14c-9.272 0-14.215 5.258-18.7 10.339C11.918 1.306 8.353 6-.02 6.002')
            .attr('stroke', '#000000')
            .attr('stroke-width', 1)
            .attr('fill', 'none')

        chart
            .selectAll('.data-pattern')
            .data(data)
            .join('rect')
            .attr('transform', d => `translate(${x(d.year)}, 0)`)
            .attr('x', d => xSubgroup(d.source))
            .attr('y', d => y(d.generation))
            .attr('width', xSubgroup.bandwidth())
            .attr('height', d => height - y(d.generation))
            .attr('fill', 'url(#wavesPattern)')
    }

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

