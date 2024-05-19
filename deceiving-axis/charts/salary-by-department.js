import { addAxis, updateXaxis, addHighlightTooltip, formatCurrency } from "../../node_modules/visual-components/index.js"
import { colours } from "../constants.js"

const plotChart = (chart, data, x, y) => {
    chart
        .selectAll('.bars')
        .data(data)
        .join('rect')
        .attr('class', 'bars')
        .attr('x', x(0))
        .attr('y', d => y(d[0]))
        .attr('height', y.bandwidth())
        .attr('fill', colours.default)
        .transition()
        .attr('width', d => x(d[1]))

    return chart.selectAll('.bars')
}

export const addChart = (data, chartProps) => {
    const { chart, width, height, margin } = chartProps

    const groupedData = d3
        .flatRollup(data, v => d3.median(v, z => z.Base_Salary), d => d.Department)
        .sort((a, b) => a[1] - b[1])

    const groupedDataFiltered = [
        ...groupedData.slice(0, 3),
        ...groupedData.slice(Math.floor(groupedData.length / 2) - 1, Math.floor(groupedData.length / 2) + 2),
        ...groupedData.slice(groupedData.length - 4, groupedData.length - 1)
    ]

    let x = d3
        .scaleLinear()
        .domain([0, d3.max(groupedDataFiltered, d => d[1])])
        .range([0, width])

    const y = d3
        .scaleBand()
        .domain(groupedDataFiltered.map(d => d[0]))
        .range([height, 0])
        .padding(0.2)

    const xFormat = d3.format('$.2s')

    const chartElements = plotChart(chart, groupedDataFiltered, x, y)

    addHighlightTooltip({
        id: 'charts',
        htmlText: d => `
        <strong>${d[0]}</strong>   
        <div style="display: flex; justify-content: space-between">
            <span>Average Salary:&emsp;</span>
            <span>${formatCurrency(d[1])}</span>
        </div>
        `,
        elements: chartElements,
        initialOpacity: 0.9,
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
        xLabel: 'Average Salary',
        yLabel: 'Department',
        xFormat: xFormat
    })

    return (scale, exponent) => {
        switch (scale) {
            case 'linear':
                x = d3
                    .scaleLinear()
                    .domain([0, d3.max(groupedDataFiltered, d => d[1])])
                    .range([0, width])
                break;
            case 'log':
                x = d3
                    .scaleLog()
                    .domain([1, d3.max(groupedDataFiltered, d => d[1])])
                    .range([0, width])
                    .base(2)
                break;
            case 'pow':
                x = d3
                    .scalePow()
                    .domain([0, d3.max(groupedDataFiltered, d => d[1])])
                    .range([0, width])
                    .exponent(exponent)
                break;
        }

        plotChart(chart, groupedDataFiltered, x, y)
        updateXaxis({
            chart: chart,
            x: x,
            format: xFormat
        })
    }
}