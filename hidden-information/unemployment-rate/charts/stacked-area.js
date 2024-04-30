import { colours } from "../constants.js"
import { addAxis } from "../../../components/axis/script.js"
import { addLegendV2 as addLegend } from "../../../components/legend/script.js"

export const plotChart = (chartProps, data) => {
    const { chart, width, height } = chartProps

    const x = d3
        .scaleTime()
        .domain(d3.extent(data, d => d.measureDate))
        .range([0, width])

    const y = d3
        .scaleLinear()
        .domain([0, 200000])
        .range([height, 0])

    addAxis({
        chart,
        height,
        width,
        x,
        y,
        xLabel: 'Year',
        yLabel: 'Population',
        yFormat: d => d3.format('.2s')(d * 1e3),
        colour: colours.axis,
        hideYdomain: true
    })

    const keys = ['outOfWorkforce', 'working', 'notWorking']

    const colour = d3
        .scaleOrdinal()
        .domain(keys)
        .range([colours.outOfWorkforce, colours.working, colours.notWorking])

    const stackedData = d3
        .stack()
        .keys(keys)
        (data)

    const area = d3
        .area()
        .x(d => x(d.data.measureDate))
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
        legends: ['Out of Workforce', 'Working', 'Not Working'],
        colours: [colours.outOfWorkforce, colours.working, colours.notWorking],
        xPos: -64,
        yPos: -32
    })
}