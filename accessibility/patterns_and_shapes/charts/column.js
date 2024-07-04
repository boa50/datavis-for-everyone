import { addAxis, addLegend } from "../../../node_modules/visual-components/index.js"
import { palette, defaultColours } from "../../../colours.js"
import { addWavesPattern, addCrossPattern, addTrianglePattern, addScalesPattern } from "./patterns.js"

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

    const plotBars = fillFunction => {
        chart
            .selectAll('.data-point')
            .data(data)
            .join('rect')
            .attr('transform', d => `translate(${x(d.year)}, 0)`)
            .attr('x', d => xSubgroup(d.source))
            .attr('y', d => y(d.generation))
            .attr('width', xSubgroup.bandwidth())
            .attr('height', d => height - y(d.generation))
            .attr('fill', fillFunction)
    }

    plotBars(d => colour(d.source))

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

        plotBars(d => `url(#${pattern(d.source)})`)
    }

    addLegend({
        chart,
        legends: energySources,
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
        yTickValues: [0, 1000, 2000, 3000, 4000, 5000],
        hideXdomain: true,
        hideYdomain: true
    })
}

