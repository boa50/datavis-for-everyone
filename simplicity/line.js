import { addAxis, addLegend, createText } from "../node_modules/visual-components/index.js"
import { palette, paletteDarkBg } from "../colours.js"

export const addChart = (
    chartProps,
    data,
    theme = 'light',
    options = {
        topLegend: false,
        focused: null,
        singleColour: false,
        lineLabel: false,
        aggregationGroup: 'Country',
        messages: false
    }
) => {
    let colourPalette
    switch (theme) {
        case 'light':
            colourPalette = structuredClone(palette)
            break
        case 'dark':
            colourPalette = structuredClone(paletteDarkBg)
            break

        default:
            colourPalette = structuredClone(palette)
            break
    }

    const { chart, width, height, margin } = chartProps
    const isFocused = options.focused !== undefined && options.focused !== null
    const anonymizator = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    const focusedColour = colourPalette.vermillion
    const axesColour = colourPalette.axis

    const yTickValues = data.length > 500 ?
        [25000, 50000, 75000, 100000, 125000, 150000] :
        options.aggregationGroup === 'Region' ?
            [10000, 20000, 30000, 40000, 50000, 60000] :
            [10000, 20000, 30000, 40000, 50000]

    if (isFocused) {
        delete colourPalette.vermillion
        delete colourPalette.axis

        data.sort(a => a.entity === options.focused ? 1 : -1)
    }

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
        yFormat: d3.format('.2s'),
        xNumTicks: 5,
        yTickValues,
        hideXdomain: true,
        hideYdomain: true
    })

    if (options.topLegend) {
        const entities = [...new Set(data.map(d => d.entity))]

        addLegend({
            chart,
            legends: entities.map(d => anonymizeEntity(d)),
            colours: [...entities.map(d => getColour(d)), focusedColour],
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
            .attr('fill', d => getColour(d.entity, 1))
            .attr('font-size', '0.85rem')
            .attr('font-weight', 500)
            .attr('dominant-baseline', 'middle')
            .text(d => anonymizeEntity(d.entity))
    }

    if (options.messages) {
        createText({
            svg: chart,
            x: x(2004),
            y: y(35000),
            width: 200,
            height: 34,
            textColour: d3.hsl(axesColour).brighter(1),
            fontSize: '0.75rem',
            htmlText: `GDP increased until 2008 due to the development of new technologies`
        })

        createText({
            svg: chart,
            x: x(2017),
            y: y(26000),
            width: 125,
            height: 34,
            textColour: d3.hsl(axesColour).brighter(1),
            fontSize: '0.75rem',
            htmlText: `Significant losses in 2020 due to COVID-19`
        })
    }

    function getColour(entity, brightness = 2.5) {
        if (isFocused && entity === options.focused) {
            return focusedColour
        } else if (options.singleColour) {
            return d3.hsl(axesColour).brighter(brightness)
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

        return (options.aggregationGroup === undefined ? 'Country' : options.aggregationGroup) + ' ' + anonymizator.shift()
    }
}
