import { addAxis, addLegend, addHighlightTooltip } from "../../../node_modules/visual-components/index.js"
import { palette, defaultColours as colours } from "../../../colours.js"

export const addChart = (chartProps, data, colour) => {
    const { chart, width, height, margin } = chartProps

    data = data.filter(d => d.year >= 2015)

    const groups = [...new Set(data.map(d => d.year))]
    const subgroups = [...new Set(data.map(d => d.country))]

    const x = d3
        .scaleBand()
        .domain(groups)
        .range([0, width])
        .padding(.1)

    const xSubgroup = d3
        .scaleBand()
        .domain(subgroups)
        .range([0, x.bandwidth()])
        .padding(.1)

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.expenditureShare) * 1.15])
        .range([height, 0])


    chart
        .selectAll('g')
        .data(data)
        .join('g')
        .attr('transform', d => `translate(${x(d.year)}, 0)`)
        .selectAll('rect')
        .data(d => [d])
        .join('rect')
        .attr('class', 'data-point')
        .attr('x', d => xSubgroup(d.country))
        .attr('y', d => y(d.expenditureShare))
        .attr('width', xSubgroup.bandwidth())
        .attr('height', d => height - y(d.expenditureShare))
        .attr('fill', d => colour(d.country))

    // addAxis({
    //     chart,
    //     height,
    //     width,
    //     colour: colours.axis,
    //     x,
    //     y,
    //     xFormat: d => d,
    //     yFormat: d => `${d}%`,
    //     yTickValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    //     xNumTicksForceInitial: true,
    //     hideXdomain: true,
    //     hideYdomain: true,
    //     yLabel: 'Expenditure (share of GDP)'
    // })

    // addLegend({
    //     chart,
    //     legends: subgroups,
    //     colours: subgroups.map(d => colour(d)),
    //     xPosition: -margin.left,
    //     yPosition: -16
    // })

    addHighlightTooltip({
        chart,
        htmlText: d => `
        <strong>${d.country} - ${d.year}</strong>
        <div style="display: flex; justify-content: space-between">
            <span>GDP Expenditure:&emsp;</span>
            <span>${d3.format('.2f')(d.expenditureShare)}%</span>
        </div>
        `,
        elements: chart.selectAll('.data-point'),
        initialOpacity: 1,
        highlightedOpacity: 1,
        fadedOpacity: 0.5,
        chartWidth: width,
        chartHeight: height
    })
}