import { addAxis, addLegend } from "../../../node_modules/visual-components/index.js"
import { palette, defaultColours } from "../../../colours.js"

export const addChart = (chartProps, data) => {
    const { chart, width, height, margin } = chartProps

    const keys = [...new Set(data.map(d => d.source))]
    const colourPalette = [palette.bluishGreen, palette.blue, palette.orange, palette.reddishPurple]

    const x = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, width])

    const colour = d3
        .scaleOrdinal()
        .domain(keys)
        .range(colourPalette)

    const groupedData = d3.group(data, d => d.year);

    const stackedData = d3
        .stack()
        .keys(keys)
        .value((d, key) => d[1].filter(v => v.source === key)[0].generation)
        (groupedData)

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(stackedData[stackedData.length - 1], d => d[1]) * 1.1])
        .range([height, 0])

    const area = d3
        .area()
        .x(d => x(d.data[0]))
        .y0(d => y(d[0]))
        .y1(d => y(d[1]))

    chart
        .selectAll('.stacks')
        .data(stackedData)
        .join('path')
        .attr('fill', d => colour(d.key))
        .attr('d', area)

    addLegend({
        chart,
        legends: keys,
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
        hideXdomain: true,
        hideYdomain: true
    })
}