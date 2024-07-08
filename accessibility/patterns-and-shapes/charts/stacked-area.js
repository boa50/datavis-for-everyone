import { addAxis, addLegend } from "../../../node_modules/visual-components/index.js"
import { checkDefaultPalette } from "../utils.js"
import { getPatternIds } from "./patterns.js"

export const addChart = (chartProps, data, colourPalette, pattern = false, shapes = false) => {
    colourPalette = checkDefaultPalette(colourPalette)
    const { chart, width, height, margin } = chartProps

    const keys = [...new Set(data.map(d => d.source))]

    const x = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, width])

    const colour = d3
        .scaleOrdinal()
        .domain(keys)
        .range(colourPalette.chart)

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
            .attr('opacity', shapes ? 0.3 : 1)
            .attr('d', area)
    }

    plotArea(d => colour(d.key))

    let legendShapes

    if (shapes) {
        const symbols = [d3.symbolCircle, d3.symbolSquare, d3.symbolTriangle, d3.symbolStar]
        legendShapes = symbols.map(d => d3.symbol(d))

        const line = d3
            .line()
            .x(d => x(d.data[0]))
            .y(d => y(d[1]))

        chart
            .selectAll('.data-line')
            .data(stackedData)
            .join('path')
            .attr('fill', 'none')
            .attr('stroke', d => colour(d.key))
            .attr('stroke-width', 2)
            .attr('d', line)

        const shapesGroup = d3
            .scaleOrdinal()
            .domain(keys)
            .range(symbols)

        chart
            .selectAll('.data-shapes')
            .data(stackedData.map(d => d.map(v => { return { ...v, key: d.key } })).flat(1))
            .join('path')
            .attr('d', d3.symbol().type(d => shapesGroup(d.key)).size(120))
            .attr('transform', d => `translate(${[x(d.data[0]), y(d[1])]})`)
            .attr('fill', d => colour(d.key))
            .attr('stroke', 'white')
            .attr('stroke-width', 1)
    }


    let patternIdsLegend

    if (pattern) {
        const patternIds = getPatternIds(chart, colourPalette.pattern)
        patternIdsLegend = patternIds[1]

        const pattern = d3
            .scaleOrdinal()
            .range(patternIds[0])
            .domain(keys)

        plotArea(d => `url(#${pattern(d.key)})`)
    }

    addLegend({
        chart,
        legends: keys,
        colours: colourPalette.chart,
        xPosition: -margin.left,
        patternIds: patternIdsLegend,
        shapes: legendShapes
    })

    addAxis({
        chart,
        height,
        width,
        colour: colourPalette.axis,
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