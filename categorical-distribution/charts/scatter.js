import { addAxis } from "../../node_modules/visual-components/index.js"
import { palette as paletteLightBg, paletteDarkBg } from "../../colours.js"

export const addChart = (chartProps, data, theme = 'light', jitter = false) => {
    const { chart, width, height } = chartProps
    const palette = theme === 'light' ? paletteLightBg : paletteDarkBg

    const x = d3
        .scaleBand()
        .domain(data.map(d => d.group))
        .range([0, width])
        .padding(.25)

    const y = d3
        .scaleLinear()
        .domain([0, d3.quantile(data.map(d => d.govSpending), 0.995) * 1.05])
        .range([height, 0])

    chart
        .selectAll('.data-points')
        .data(data)
        .join('circle')
        .attr('class', 'data-points')
        .attr('r', 5)
        .attr('fill', palette.blue)
        .style('opacity', 0.95)
        .attr('stroke', palette.axis)
        .attr('stroke-width', 0.5)
        .transition()
        .attr('cx', d => x(d.group) + (jitter ? Math.random() * x.bandwidth() : x.bandwidth() / 2))
        .attr('cy', d => y(d.govSpending))

    addAxis({
        chart,
        height,
        width,
        colour: palette.axis,
        x,
        y,
        yNumTicks: 5,
        yNumTicksForceInitial: true
    })
}