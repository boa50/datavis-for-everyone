import { addAxis, addHighlightTooltip, addColourLegend } from "../../../node_modules/visual-components/index.js"
import { palette, defaultColours as colours } from "../../../colours.js"

export const addChart = (chartProps, data, countryColour) => {
    const { chart, width, height, margin } = chartProps

    const years = [...new Set(data.map(d => d.year))].sort()
    const countries = [...new Set(data.map(d => d.country))].reverse()

    const x = d3
        .scaleBand()
        .domain(years)
        .range([0, width])
        .padding(0.25)

    const y = d3
        .scaleBand()
        .domain(countries)
        .range([height, 0])
        .padding(0.25)

    const colour = d =>
        d3
            .scaleLinear()
            .range([d3.hsl(countryColour(d.country)).darker(1), d3.hsl(countryColour(d.country)).brighter(1)])
            .domain([0, Math.trunc(d3.max(data, d => d.expenditureShare)) + 1])

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

    // addAxis({
    //     chart,
    //     height,
    //     width,
    //     colour: colours.axis,
    //     x,
    //     y,
    //     hideXdomain: true,
    //     hideYdomain: true
    // })

    chart
        .selectAll('.x-axis-group .tick text')
        .attr('transform', 'rotate(45)')
        .attr('text-anchor', 'start')
        .attr('dx', '0.1rem')
        .attr('dy', '0.1rem')


    const colourLegendWidth = 100

    const colourLegendScale = d3
        .scaleLinear()
        .range([d3.hsl(colours.axis).brighter(1), d3.hsl(colours.axis).darker(1)])
        .domain(colour({}).domain())

    const colourLegendAxis = d3
        .scaleLinear()
        .domain(colourLegendScale.domain())
        .range([0, colourLegendWidth])

    // addColourLegend({
    //     chart,
    //     title: 'GDP Expenditure',
    //     colourScale: colourLegendScale,
    //     axis: colourLegendAxis,
    //     width: colourLegendWidth,
    //     textColour: colours.axis,
    //     xPosition: -margin.left + 4,
    //     yPosition: height + margin.bottom - 60,
    //     axisTickFormat: d => d > 0 ? `${d}%` : d
    // })

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