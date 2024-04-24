import { addAxis, updateXaxis } from "../../components/axis/script.js"
import { colours } from "../constants.js"
import { addHighlightTooltip } from "../../components/tooltip/script.js"
import { formatCurrency } from "../../components/utils.js"

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

export const addChart = ({
    data,
    chartProps,
    xAxis = {
        type,
        exponent
    }
}) => {
    const { chart, width, height, margin } = chartProps

    const groupedData = d3
        .flatRollup(data, v => d3.median(v, z => z.Base_Salary), d => d.Gender)
        .sort((a, b) => a[1] - b[1])


    let x = d3
        .scaleLinear()
        .domain([0, d3.max(groupedData, d => d[1])])
        .range([0, width])

    const y = d3
        .scaleBand()
        .domain(groupedData.map(d => d[0]))
        .range([height, 0])
        .padding(0.2)

    const xFormat = d3.format('$.2s')

    const updateChart = () => {
        const scale = xAxis.type.value
        const exponent = xAxis.exponent.value

        switch (scale) {
            case 'linear':
                x = d3
                    .scaleLinear()
                    .domain([0, d3.max(groupedData, d => d[1])])
                    .range([0, width])
                break;
            case 'log':
                x = d3
                    .scaleLog()
                    .domain([1, d3.max(groupedData, d => d[1])])
                    .range([0, width])
                    .base(2)
                break;
            case 'pow':
                x = d3
                    .scalePow()
                    .domain([0, d3.max(groupedData, d => d[1])])
                    .range([0, width])
                    .exponent(exponent)
                break;
        }

        plotChart(chart, groupedData, x, y)
        updateXaxis({
            chart: chart,
            x: x,
            format: xFormat
        })

    }

    xAxis.type.addEventListener('change', () => { updateChart() })
    xAxis.exponent.addEventListener('change', () => { updateChart() })

    const chartElements = plotChart(chart, groupedData, x, y)

    const { mouseover, mousemove, mouseleave } = addHighlightTooltip(
        'charts',
        d => `
        <strong>${d[0] === 'M' ? 'Male' : 'Female'}</strong>   
        <div style="display: flex; justify-content: space-between">
            <span>Average Salary:&emsp;</span>
            <span>${formatCurrency(d[1])}</span>
        </div>
        `,
        chartElements,
        { initial: 0.9, faded: 0.5, highlighted: 1 },
    )
    chartElements
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseleave', mouseleave)

    addAxis({
        chart: chart,
        height: height,
        width: width,
        margin: margin,
        x: x,
        y: y,
        colour: colours.axis,
        xLabel: 'Average Salary',
        yLabel: 'Gender',
        xFormat: xFormat
    })
}