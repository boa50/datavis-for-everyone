import { addAxis } from "../node_modules/visual-components/index.js"
import { palette } from "../colours.js"

export const addChart = (chartProps, data, focused, lineLabel = false) => {
    const { chart, width, height } = chartProps
    const isFocused = focused !== undefined && focused !== null

    if (isFocused) data.sort(a => a.entity === focused ? 1 : -1)

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
        .range(Object.values(palette))

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

    if (lineLabel) {
        const lineLabelPoints = data.filter(d => d.year == x.domain()[1])

        chart
            .selectAll('.data-label-points')
            .data(lineLabelPoints)
            .join('text')
            .attr('x', x(x.domain()[1]) + 5)
            .attr('y', d => y(d.gdpPerCapita))
            .attr('fill', d => getColour(d.entity))
            .attr('dominant-baseline', 'middle')
            .text(d => d.entity)
    }



    addAxis({
        chart,
        height,
        width,
        colour: palette.axis,
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


    function getColour(entity) {
        if (isFocused) {
            if (entity === focused) {
                return palette.vermillion
            } else {
                return d3.hsl(palette.axis).brighter(2.5)
            }
        } else {
            return colour(entity)
        }
    }

    function getStrokeWidth(entity) {
        if (isFocused && entity === focused) {
            return 5
        }

        return 2
    }
}
