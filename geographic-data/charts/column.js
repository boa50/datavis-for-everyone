import { addAxis, formatCurrency } from "../../node_modules/visual-components/index.js"
import { palette } from "../../colours.js"

export const addChart = (chartProps, data) => {
    const { chart, width, height } = chartProps

    data.sort((a, b) => b.gdpPerCapita - a.gdpPerCapita)
    data = data.slice(0, 5)

    const x = d3
        .scaleBand()
        .domain(data.map(d => d.country))
        .range([0, width])
        .padding(.25)

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.gdpPerCapita)])
        .range([height, 0])

    chart
        .selectAll('.data-point')
        .data(data)
        .join('rect')
        .attr('class', 'data-point')
        .attr('x', d => x(d.country))
        .attr('y', d => y(d.gdpPerCapita))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.gdpPerCapita))
        .attr('fill', palette.blue)

    addAxis({
        chart,
        height,
        width,
        x,
        y,
        colour: palette.axis,
        yLabel: 'GDP per Capita',
        yFormat: d => d > 0 ? `${formatCurrency(d / 1000)}k` : d,
        yNumTicks: 5,
        yNumTicksForceInitial: true,
        hideXdomain: true,
        hideYdomain: true
    })
}