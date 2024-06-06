import { addAxis, addHighlightTooltip } from "../../node_modules/visual-components/index.js"
import { palette, defaultColours as colours } from "../../colours.js"

export const addChart = (chartProps, data, countryColour) => {
    const { chart, width, height } = chartProps

    const years = [...new Set(data.map(d => d.year))].sort()
    const countries = [...new Set(data.map(d => d.country))].reverse()

    const x = d3
        .scaleBand()
        .domain(years)
        .range([0, width])
        .padding(0.05)

    const y = d3
        .scaleBand()
        .domain(countries)
        .range([height, 0])
        .padding(0.05)

    const colour = d =>
        d3
            .scaleLinear()
            .range([d3.hsl(countryColour(d.country)).brighter(1), d3.hsl(countryColour(d.country)).darker(1)])
            .domain([0, d3.max(data, d => d.expenditureShare)])

    chart
        .selectAll('.data-point')
        .data(data)
        .join('rect')
        .attr('class', 'data-point')
        .attr('x', d => x(d.year))
        .attr('y', d => y(d.country))
        .attr('width', x.bandwidth())
        .attr('height', y.bandwidth())
        .attr('rx', 4)
        .attr('ry', 4)
        .style('fill', d => colour(d)(d.expenditureShare))

    // Tooltip
    chart
        .selectAll('.tooltip-point')
        .data(data)
        .join('rect')
        .attr('class', 'tooltip-point')
        .attr('x', d => x(d.year))
        .attr('y', d => y(d.country))
        .attr('width', x.bandwidth())
        .attr('height', y.bandwidth())
        .attr('rx', 4)
        .attr('ry', 4)
        .attr('stroke-width', 4)
        .attr('stroke', palette.vermillion)
        .attr('opacity', 0)
        .style('fill', 'transparent')

    addAxis({
        chart,
        height,
        width,
        colour: colours.axis,
        x,
        y,
        hideXdomain: true,
        hideYdomain: true
    })

    addHighlightTooltip({
        chart,
        htmlText: d => `
        <strong>${d.country} - ${d.year}</strong>
        <div style="display: flex; justify-content: space-between">
            <span>GDP Expenditure:&emsp;</span>
            <span>${d3.format('.2f')(d.expenditureShare)}%</span>
        </div>
        `,
        elements: chart.selectAll('.tooltip-point'),
        initialOpacity: 0,
        highlightedOpacity: 0.75,
        fadedOpacity: 0,
        chartWidth: width,
        chartHeight: height
    })
}