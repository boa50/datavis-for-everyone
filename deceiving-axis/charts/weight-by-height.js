import { addAxis, updateXaxis } from "../../components/axis/script.js"
import { colours } from "../constants.js"

const plotChart = (chart, data, x, y) => {
    chart
        .selectAll('.data-points')
        .data(data)
        .join('circle')
        .attr('class', 'data-points')
        .attr('r', 3)
        .attr('fill', '#69b3a2')
        .style('opacity', 0.75)
        .attr('stroke', '#6b7280')
        .attr('stroke-width', 0.5)
        .transition()
        .attr('cx', d => x(d.Weight))
        .attr('cy', d => y(d.Height))
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
    let x = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.Weight))
        .range([0, width])

    let y = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.Height))
        .range([height, 0])

    const xFormat = d => `${d}kg`

    const updateChart = () => {
        const scale = xAxis.type.value
        const exponent = xAxis.exponent.value

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

    xAxis.type.addEventListener('change', () => { updateChart() })
    xAxis.exponent.addEventListener('change', () => { updateChart() })

    plotChart(chart, data, x, y)
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
}