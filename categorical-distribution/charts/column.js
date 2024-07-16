import { addAxis } from "../../node_modules/visual-components/index.js"
import { palette } from "../../colours.js"

export const addChart = (chartProps, data, errorLine = false) => {
    const { chart, width, height } = chartProps

    const groups = [...new Set(data.map(d => d.group))]

    const dataGrouped = groups.map(grp => {
        const dataFiltered = data.filter(d => d.group === grp)
        const govSpendings = dataFiltered.map(d => d.govSpending)

        return {
            group: grp,
            average: dataFiltered.reduce((t, c) => t + c.govSpending, 0) / dataFiltered.length,
            q25: d3.quantile(govSpendings, 0.25),
            q75: d3.quantile(govSpendings, 0.75)
        }
    })

    const x = d3
        .scaleBand()
        .domain(dataGrouped.map(d => d.group))
        .range([0, width])
        .padding(.25)

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(dataGrouped, d => d.q75 * 1.05)])
        .range([height, 0])

    chart
        .selectAll('.data-point')
        .data(dataGrouped)
        .join('rect')
        .attr('class', 'data-point')
        .attr('x', d => x(d.group))
        .attr('y', d => y(d.average))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.average))
        .attr('fill', palette.blue)

    if (errorLine) {
        const lineColour = palette.orange
        const lineWidth = 7
        chart
            .selectAll('.error-line')
            .data(dataGrouped)
            .join('rect')
            .attr('x', d => x(d.group) + (x.bandwidth() / 2) - (lineWidth / 2))
            .attr('y', d => y(d.q75))
            .attr('width', lineWidth)
            .attr('height', d => height - y(d.q75 - d.q25))
            .attr('fill', lineColour)

        const divisorLink = 26
        const addDivisor = field => {
            chart
                .selectAll('.error-line')
                .data(dataGrouped)
                .join('rect')
                .attr('x', d => x(d.group) + (x.bandwidth() / 2) - (divisorLink / 2))
                .attr('y', d => y(d[field]))
                .attr('width', divisorLink)
                .attr('height', 3)
                .attr('fill', lineColour)
        }

        addDivisor('q25')
        addDivisor('q75')
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