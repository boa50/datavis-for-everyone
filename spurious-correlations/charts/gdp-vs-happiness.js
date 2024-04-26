import { colours } from "../constants.js"
import { addAxis } from "../../components/axis/script.js"
import { addLegendV2 as addLegend } from "../../components/legend/script.js"
import { formatCurrency } from "../../components/utils.js"
import { addHighlightTooltip } from "../../components/tooltip/script.js"

const getData = () =>
    d3.csv('./data/gdp-vs-happiness-2021.csv')
        .then(d => d.map(v => {
            return {
                ...v,
                gdpPerCapita: +v.gdpPerCapita,
                lifeSatisfaction: +v.lifeSatisfaction
            }
        }))

const getScales = (data, height, width, linearScales = true) => {
    let x, y

    if (linearScales) {
        x = d3
            .scaleLinear()
            .domain(d3.extent(data, d => d.gdpPerCapita).map((d, i) => d * [0.9, 1.1][i]))
            .range([0, width])

        y = d3
            .scaleLinear()
            .domain([0, 10])
            .range([height, 0])
    } else {
        x = d3
            .scaleLog()
            .domain(d3.extent(data, d => d.gdpPerCapita).map((d, i) => d * [0.9, 1.1][i]))
            .range([0, width])

        y = d3
            .scaleLinear()
            .domain([1, 8.5])
            .range([height, 0])
    }

    return { x, y }
}

export const plotChart = (chartProps, linearScales = true) => {
    const { chart, width, height, margin } = chartProps

    getData().then(data => {
        const { x, y } = getScales(data, height, width, linearScales)
        const xAxisTicks = linearScales ? undefined : [1, 2, 5, 15, 30, 60, 120].map(d => d * 1e3)
        const yAxisTicks = linearScales ? undefined : [...Array(7).keys()].map(i => i + 2)

        addAxis({
            chart: chart,
            height: height,
            width: width,
            x: x,
            y: y,
            xLabel: 'GDP per capita',
            yLabel: 'Life satisfaction (0 - 10)',
            xFormat: d => `${formatCurrency(d / 1000)}k`,
            yFormat: d3.format('.1s'),
            colour: colours.axis,
            hideYdomain: true,
            xTickValues: xAxisTicks,
            yTickValues: yAxisTicks
        })

        const continents = [...new Set(data.map(d => d.continent))].sort()
        const continentColours = [colours.africa, colours.asia, colours.europe, colours.northAmerica, colours.oceania, colours.southAmerica]
        const colour = d3
            .scaleOrdinal()
            .domain(continents)
            .range(continentColours)

        chart
            .selectAll('.data-points')
            .data(data)
            .join('circle')
            .attr('class', 'data-points')
            .attr('r', 5)
            .attr('fill', d => colour(d.continent))
            .style('opacity', 0.75)
            .attr('stroke', '#6b7280')
            .attr('stroke-width', 0.5)
            .transition()
            .attr('cx', d => x(d.gdpPerCapita))
            .attr('cy', d => y(d.lifeSatisfaction))

        addLegend({
            chart: chart,
            legends: continents,
            colours: continentColours,
            xPos: -64,
            yPos: -32
        })

        addHighlightTooltip(
            'charts',
            d => `
            <strong>${d.country}</strong>   
            <div style="display: flex; justify-content: space-between">
                <span>Life Satisfaction:&emsp;</span>
                <span>${d3.format('.2f')(d.lifeSatisfaction)}</span>
            </div>
            <div style="display: flex; justify-content: space-between">
                <span>GDP per Capita:&emsp;</span>
                <span>${formatCurrency(d.gdpPerCapita)}</span>
            </div>
            `,
            chart.selectAll('.data-points')
        )

    })
}