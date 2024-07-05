import { addAxis, addLegend } from "../../../node_modules/visual-components/index.js"
import { palette, defaultColours } from "../../../colours.js"

export const addChart = (chartProps, data, shapes = false, dashed = false) => {
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

    const dasharray = d3
        .scaleOrdinal()
        .range(['4', '12 2 12 2', '12 4 4 4', '16'])
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
        .attr('stroke-dasharray', dashed ? d => dasharray(d[0]) : 0)
        .attr('d', d => line(d[1]))

    let legendShapes

    if (shapes) {
        const symbols = [d3.symbolCircle, d3.symbolSquare, d3.symbolTriangle, d3.symbolStar]
        legendShapes = symbols.map(d => d3.symbol(d))

        const shapesGroup = d3
            .scaleOrdinal()
            .domain(energySources)
            .range(symbols)

        chart
            .selectAll('.data-shapes')
            .data(data)
            .join('path')
            .attr('d', d3.symbol().type(d => shapesGroup(d.source)).size(120))
            .attr('transform', d => `translate(${[x(d.year), y(d.generation)]})`)
            .attr('stroke-width', 1)
            .attr('stroke', 'white')
            .attr('fill', d => colour(d.source))
    }

    let patternIdsLegend

    if (dashed) {
        const addDashPattern = (id, path) => {
            chart
                .append('defs')
                .append('pattern')
                .attr('id', id)
                .attr('width', 40)
                .attr('height', 40)
                .append('path')
                .attr('d', path)
                .attr('stroke', 'white')
                .attr('stroke-width', 40)
                .attr('fill', 'none')

        }

        const patterns = [
            { id: 'dashPattern1Id', path: 'M 2 20 H 4 M 6 20 H 8 M 10 20 H 12 M 14 20 H 16' },
            { id: 'dashPattern2Id', path: 'M 4 20 H 5 M 9 20 H 10 M 14 20 H 15 M 19 20 H 20' },
            { id: 'dashPattern3Id', path: 'M 4 20 H 6 M 8 20 H 10 M 14 20 H 16 M 18 20 H 20' },
            { id: 'dashPattern4Id', path: 'M 4 20 H 8 M 12 20 H 16' }
        ]

        patternIdsLegend = []

        patterns.forEach(p => {
            addDashPattern(p.id, p.path)
            patternIdsLegend.push(p.id)
        })
    }

    addLegend({
        chart,
        legends: energySources,
        colours: colourPalette,
        xPosition: -margin.left,
        shapes: legendShapes,
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
        yTickValues: [0, 1000, 2000, 3000, 4000, 5000],
        hideXdomain: true,
        hideYdomain: true
    })
}