import { addAxis } from "../node_modules/visual-components/index.js"
import { palette } from "../colours.js"

export const addChart = (chartProps, data) => {
    const { chart, width, height } = chartProps

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
        .attr('stroke', d => colour(d[0]))
        .attr('stroke-width', 2)
        .attr('d', d => line(d[1]))

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
}