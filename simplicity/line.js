import { addAxis, addLegend } from "../node_modules/visual-components/index.js"
import { palette } from "../colours.js"

export const addChart = (
    chartProps,
    data,
    options = {
        topLegend: false,
        focused: null,
        singleColour: false,
        lineLabel: false,
        aggregationGroup: 'Country'
    }
) => {
    const { chart, width, height, margin } = chartProps
    const isFocused = options.focused !== undefined && options.focused !== null
    const anonymizator = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    const colourPalette = structuredClone(palette)
    const focusedColour = colourPalette.vermillion
    const axesColour = colourPalette.axis
    delete colourPalette.vermillion
    delete colourPalette.axis


    if (isFocused) data.sort(a => a.entity === options.focused ? 1 : -1)

    const x = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, width])

    const y = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.gdpPerCapita).map((d, i) => d * [0, 1.05][i]))
        .range([height, 0])

    const dataPerGroup = d3.group(data, d => d.entity)
    const colour = d3
        .scaleOrdinal()
        .range(Object.values(colourPalette))

    const line = d3
        .line()
        .x(d => x(d.year))
        .y(d => y(d.gdpPerCapita))

    chart
        .selectAll('.data-line')
        .data(dataPerGroup)
        .join('path')
        .attr('fill', 'none')
        .attr('stroke', d => getColour(d[0]))
        .attr('stroke-width', d => getStrokeWidth(d[0]))
        .attr('d', d => line(d[1]))

    addAxis({
        chart,
        height,
        width,
        colour: axesColour,
        x,
        y,
        xLabel: 'Year',
        yLabel: 'Gdp per capita (2017 $)',
        xFormat: d => d,
        xNumTicks: 5,
        yNumTicks: 7,
        hideXdomain: true,
        hideYdomain: true
    })

    if (options.topLegend) {
        const entities = [...new Set(data.map(d => d.entity))]

        addLegend({
            chart,
            legends: entities.map(d => anonymizeEntity(d)),
            colours: [entities.map(d => getColour(d)), focusedColour],
            xPosition: -margin.left,
            yPosition: -16
        })
    }

    if (options.lineLabel) {
        const lineLabelPoints = data.filter(d => d.year == x.domain()[1])

        chart
            .selectAll('.data-label-points')
            .data(lineLabelPoints)
            .join('text')
            .attr('x', x(x.domain()[1]) + 5)
            .attr('y', d => y(d.gdpPerCapita))
            .attr('fill', d => getColour(d.entity))
            .attr('font-size', '0.85rem')
            .attr('dominant-baseline', 'middle')
            .text(d => d.entity)
    }

    function getColour(entity) {
        if (isFocused && entity === options.focused) {
            return focusedColour
        } else if (options.singleColour) {
            return d3.hsl(axesColour).brighter(2.5)
        } else {
            return colour(entity)
        }
    }

    function getStrokeWidth(entity) {
        if (isFocused && entity === options.focused) {
            return 5
        }

        return 2
    }

    function anonymizeEntity(entity) {
        if (isFocused && entity === options.focused) {
            return 'Country X'
        }

        return options.aggregationGroup === undefined ? 'Country ' + anonymizator.shift() : options.aggregationGroup
    }
}
