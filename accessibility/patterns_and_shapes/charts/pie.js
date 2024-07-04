import { palette } from "../../../colours.js"
import { addWavesPattern, addCrossPattern, addTrianglePattern, addScalesPattern } from "./patterns.js"

export const addChart = (chartProps, data, pattern) => {
    const { chart, width, height } = chartProps

    chart.attr('transform', `translate(${[width / 2, height / 2]})`)

    const energySources = [...new Set(data.map(d => d.source))]
    const colourPalette = [palette.bluishGreen, palette.blue, palette.orange, palette.reddishPurple]

    const pieData = d3
        .pie()
        .value(d => d[1])
        .sort((a, b) => (a, b))
        (data.map(d => [d.source, d.generation]))

    const colour = d3
        .scaleOrdinal()
        .range(colourPalette)
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
        const wavesPatternId = addWavesPattern(chart)
        const crossPatternId = addCrossPattern(chart)
        const trianglePatternId = addTrianglePattern(chart)
        const scalesPatternId = addScalesPattern(chart)

        const wavesPatternIdLegend = addWavesPattern(chart, 0.7)
        const crossPatternIdLegend = addCrossPattern(chart, 0.7)
        const trianglePatternIdLegend = addTrianglePattern(chart, 0.7)
        const scalesPatternIdLegend = addScalesPattern(chart, 0.7)

        const patternIds = [wavesPatternId, trianglePatternId, scalesPatternId, crossPatternId]
        patternIdsLegend = [wavesPatternIdLegend, trianglePatternIdLegend, scalesPatternIdLegend, crossPatternIdLegend]

        const pattern = d3
            .scaleOrdinal()
            .range(patternIds)
            .domain(energySources)

        plotSlices(d => `url(#${pattern(d.data[0])})`)
    }
}