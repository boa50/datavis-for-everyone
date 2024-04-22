import { addAxis, updateXaxis } from "../../components/axis/script.js"
import { colours } from "../constants.js"

const plotChart = (chart, data, x, y) => {
    chart
        .selectAll('.points')
        .data(data)
        .join('circle')
        .attr('cx', d => x(d.Weight))
        .attr('cy', d => y(d.Height))
        .attr('r', 3)
        .attr('fill', '#69b3a2')
        .style('opacity', 0.75)
        .attr('stroke', '#6b7280')
        .attr('stroke-width', 0.5)
}

export const addChart = ({ data, chart, width, height, margin, xAxisSelect }) => {
    let x = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.Weight))
        .range([0, width])

    let y = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.Height))
        .range([height, 0])

    xAxisSelect.addEventListener('change', event => {
        const scale = event.target.value

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
                break;
            case 'pow':
                x = d3
                    .scalePow()
                    .domain(d3.extent(data, d => d.Weight))
                    .range([0, width])
                break;
        }

        plotChart(chart, data, x, y)
        updateXaxis({
            chart: chart,
            x: x
        })
    })

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
        yLabel: 'Height'
    })
}