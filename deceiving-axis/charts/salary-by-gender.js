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
        .attr('width', d => x(d[1]))
        .attr('height', y.bandwidth())
        .attr('fill', '#69b3a2')
}

export const addChart = ({ data, chart, width, height, margin, xAxisSelect }) => {
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

    xAxisSelect.addEventListener('change', event => {
        const scale = event.target.value

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
                break;
            case 'pow':
                x = d3
                    .scalePow()
                    .domain([10, d3.max(groupedData, d => d[1])])
                    .range([0, width])
                break;
        }

        plotChart(chart, groupedData, x, y)
        updateXaxis({
            chart: chart,
            x: x,
            format: xFormat
        })
    })

    plotChart(chart, groupedData, x, y)
    addAxis({
        chart: chart,
        height: height,
        width: width,
        margin: margin,
        x: x,
        y: y,
        colour: colours.axis,
        xLabel: 'Salary',
        yLabel: 'Gender',
        xFormat: xFormat
    })
}