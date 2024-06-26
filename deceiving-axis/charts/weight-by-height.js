import { addAxis, updateXaxis, addHighlightTooltip, addLegend } from "../../node_modules/visual-components/index.js"
import { colours } from "../constants.js"

const plotChart = (chart, data, x, y) => {
    const colour = d3
        .scaleOrdinal()
        .domain(['Male', 'Female'])
        .range([colours.male, colours.female])

    chart
        .selectAll('.data-points')
        .data(data)
        .join('circle')
        .attr('class', 'data-points')
        .attr('r', 3)
        .attr('fill', d => colour(d.Gender))
        .style('opacity', 0.75)
        .attr('stroke', '#6b7280')
        .attr('stroke-width', 0.5)
        .transition()
        .attr('cx', d => x(d.Weight))
        .attr('cy', d => y(d.Height))

    return chart.selectAll('.data-points')
}

export const addChart = (data, chartProps) => {
    const { chart, width, height, margin } = chartProps

    let x = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.Weight))
        .range([0, width])

    let y = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.Height))
        .range([height, 0])

    const xFormat = d => `${d}kg`

    const chartElements = plotChart(chart, data, x, y)

    addHighlightTooltip({
        id: 'charts',
        htmlText: d => `
        <strong>${d.Gender}</strong>
        <div style="display: flex; justify-content: space-between">
            <span>Height:&emsp;</span>
            <span>${d3.format('.2f')(d.Height)}m</span>
        </div>
        <div style="display: flex; justify-content: space-between">
            <span>Weight:&emsp;</span>
            <span>${d3.format('.0f')(d.Weight)}kg</span>
        </div>
        `,
        elements: chartElements,
        fadedOpacity: 0.5
    })

    addAxis({
        chart: chart,
        height: height,
        width: width,
        margin: margin,
        x: x,
        y: y,
        colour: colours.axis,
        xLabel: 'Weight',
        yLabel: 'Height (m)',
        xFormat: xFormat
    })

    const legendId = 'salary-by-department-legend'
    chart
        .append('g')
        .attr('id', legendId)
        .attr('transform', 'translate(-64, -24)')

    addLegend({
        chart,
        legends: ['Male', 'Female'],
        colours: [colours.male, colours.female],
        xPosition: 5,
        yPosition: 15
    })

    return (scale, exponent) => {
        switch (scale) {
            case 'linear':
                x = d3
                    .scaleLinear()
                    .domain(d3.extent(data, d => d.Weight))
                    .range([0, width])
                break;
            case 'log':
                x = d3
                    .scaleLog()
                    .domain(d3.extent(data, d => d.Weight))
                    .range([0, width])
                    .base(2)
                break;
            case 'pow':
                x = d3
                    .scalePow()
                    .domain(d3.extent(data, d => d.Weight))
                    .range([0, width])
                    .exponent(exponent)
                break;
        }

        plotChart(chart, data, x, y)
        updateXaxis({
            chart: chart,
            x: x,
            format: xFormat
        })
    }
}