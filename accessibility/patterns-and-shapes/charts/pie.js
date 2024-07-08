import { checkDefaultPalette } from "../utils.js"
import { getPatternIds } from "./patterns.js"

export const addChart = (chartProps, data, colourPalette, pattern = false) => {
    colourPalette = checkDefaultPalette(colourPalette)
    const { chart, width, height } = chartProps

    chart.attr('transform', `translate(${[width / 2, height / 2]})`)

    const energySources = [...new Set(data.map(d => d.source))]

    const pieData = d3
        .pie()
        .value(d => d[1])
        .sort((a, b) => (a, b))
        (data.map(d => [d.source, d.generation]))

    const colour = d3
        .scaleOrdinal()
        .range(colourPalette.chart)
        .domain(energySources)

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(height / 2)

    const plotSlices = fillFunction => {
        chart
            .selectAll('.my-slices')
            .data(pieData)
            .join('path')
            .attr('d', arc)
            .attr('fill', fillFunction)
            .attr('stroke', 'white')
            .attr('stroke-width', 1)
            .style('opacity', 0.9)

    }

    plotSlices(d => colour(d.data[0]))

    let patternIdsLegend

    if (pattern) {
        const patternIds = getPatternIds(chart, colourPalette.pattern)
        patternIdsLegend = patternIds[1]

        const pattern = d3
            .scaleOrdinal()
            .range(patternIds[0])
            .domain(energySources)

        plotSlices(d => `url(#${pattern(d.data[0])})`)
    }
}