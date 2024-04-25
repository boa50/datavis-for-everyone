import { colours } from "../constants.js"
import { addAxis } from "../../components/axis/script.js"
import { addLegendV2 as addLegend } from "../../components/legend/script.js"
import { formatCurrency } from "../../components/utils.js"

const getData = () =>
    d3.csv('./data/gdp-vs-happiness-2021.csv')
        .then(d => d.map(v => {
            return {
                ...v,
                gdpPerCapita: +v.gdpPerCapita,
                lifeSatisfaction: +v.lifeSatisfaction
            }
        }))

export const plotChart = chartProps => {
    const { chart, width, height, margin } = chartProps

    getData().then(data => {
        const x = d3
            .scaleLinear()
            .domain(d3.extent(data, d => d.gdpPerCapita))
            .range([0, width])

        const y = d3
            .scaleLinear()
            .domain(d3.extent(data, d => d.lifeSatisfaction).map((d, i) => d * [0.95, 1.05][i]))
            .range([height, 0])

        addAxis({
            chart: chart,
            height: height,
            width: width,
            x: x,
            y: y,
            xLabel: 'GDP per capita',
            yLabel: 'Life satisfaction (0 - 10)',
            xFormat: formatCurrency,
            yFormat: d3.format('.1s'),
            colour: colours.axis,
            hideYdomain: true
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
            yPos: -8
        })

    })
}