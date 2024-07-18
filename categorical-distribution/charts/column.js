import { addAxis } from "../../node_modules/visual-components/index.js"
import { palette as paletteLightBg, paletteDarkBg } from "../../colours.js"

export const addChart = (chartProps, data, theme = 'light', errorLine = false) => {
    const { chart, width, height } = chartProps
    const palette = theme === 'light' ? paletteLightBg : paletteDarkBg

    const x = d3
        .scaleBand()
        .domain(data.map(d => d.group))
        .range([0, width])
        .padding(.25)

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.q3 * 1.05)])
        .range([height, 0])

    chart
        .selectAll('.data-point')
        .data(data)
        .join('rect')
        .attr('class', 'data-point')
        .attr('x', d => x(d.group))
        .attr('y', d => y(d.average))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.average))
        .attr('fill', palette.blue)

    if (errorLine) {
        const lineColour = palette.orange

        chart
            .selectAll('.error-line')
            .data(data)
            .join('line')
            .attr('x1', d => x(d.group) + (x.bandwidth() / 2))
            .attr('x2', d => x(d.group) + (x.bandwidth() / 2))
            .attr('y1', d => y(d.q1))
            .attr('y2', d => y(d.q3))
            .attr('stroke-width', 4)
            .attr('stroke', lineColour)

        const addDivisor = field => {
            const divisorWidth = 26
            chart
                .selectAll('.divisor-line')
                .data(data)
                .join('line')
                .attr('x1', d => x(d.group) + (x.bandwidth() / 2) - (divisorWidth / 2))
                .attr('x2', d => x(d.group) + (x.bandwidth() / 2) + (divisorWidth / 2))
                .attr('y1', d => y(d[field]))
                .attr('y2', d => y(d[field]))
                .attr('stroke-width', 3)
                .attr('stroke', lineColour)
        }

        addDivisor('q1')
        addDivisor('q3')
    }

    addAxis({
        chart,
        height,
        width,
        colour: palette.axis,
        x,
        y
    })
}