import { addAxis, updateXaxis } from "../../components/axis/script.js"
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
        .attr('fill', '#69b3a2')
        .transition()
        .attr('width', d => x(d[1]))
}

export const addChart = ({
    data,
    chart,
    width,
    height,
    margin,
    xAxis = {
        type,
        exponent
    }
}) => {
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

    const updateChart = () => {
        const scale = xAxis.type.value
        const exponent = xAxis.exponent.value

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

    xAxis.type.addEventListener('change', () => { updateChart() })
    xAxis.exponent.addEventListener('change', () => { updateChart() })

    plotChart(chart, groupedDataFiltered, x, y)
    addAxis({
        chart: chart,
        height: height,
        width: width,
        margin: margin,
        x: x,
        y: y,
        colour: colours.axis,
        xLabel: 'Salary',
        yLabel: 'Department',
        xFormat: xFormat
    })
}