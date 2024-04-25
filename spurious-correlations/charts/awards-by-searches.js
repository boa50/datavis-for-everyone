import { colours } from "../constants.js"
import { addAxis } from "../../components/axis/script.js"
import { addLegendV2 as addLegend } from "../../components/legend/script.js"

const getData = () =>
    d3.json('./data/awards_by_searches.json')

export const plotChart = chartProps => {
    const { chart, width, height, margin } = chartProps

    getData().then(data => {
        const x = d3
            .scaleLinear()
            .domain(d3.extent(data, d => d.year))
            .range([0, width])

        const yLeft = d3
            .scaleLinear()
            .domain(d3.extent(data, d => d.awards))
            .range([height, 0])

        const yRight = d3
            .scaleLinear()
            .domain(d3.extent(data, d => d.searches))
            .range([height, 0])

        const lineAwards = d3
            .line()
            .x(d => x(d.year))
            .y(d => yLeft(d.awards))

        const lineSearches = d3
            .line()
            .x(d => x(d.year))
            .y(d => yRight(d.searches))

        addAxis({
            chart: chart,
            height: height,
            width: width,
            x: x,
            y: yLeft,
            yRight: yRight,
            xLabel: 'Year',
            yLabel: 'Degrees awarded',
            yRightLabel: 'Relative search volume',
            colour: colours.axis,
            hideYdomain: true
        })

        const strokeWidth = 3
        chart
            .append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', colours.line1)
            .attr('stroke-width', strokeWidth)
            .attr('d', d => lineAwards(d))

        chart
            .append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', colours.line2)
            .attr('stroke-width', strokeWidth)
            .attr('d', d => lineSearches(d))

        addLegend({
            chart: chart,
            legends: ['Degrees awarded', 'Search volume'],
            colours: [colours.line1, colours.line2]
        })
    })
}