import { addAxis, addLegend } from "../../../node_modules/visual-components/index.js"
import { palette, defaultColours } from "../../../colours.js"
import { addWavesPattern, addCrossPattern, addTrianglePattern, addScalesPattern } from "./patterns.js"

export const addChart = (chartProps, data, pattern = false) => {
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

    const plotArea = fillFunction => {
        chart
            .selectAll('.stacks')
            .data(stackedData)
            .join('path')
            .attr('fill', fillFunction)
            .attr('stroke-width', 1)
            .attr('stroke', 'white')
            .attr('d', area)
    }

    plotArea(d => colour(d.key))

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
            .domain(keys)

        plotArea(d => `url(#${pattern(d.key)})`)
    }

    addLegend({
        chart,
        legends: keys,
        colours: colourPalette,
        xPosition: -margin.left,
        patternIds: patternIdsLegend
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