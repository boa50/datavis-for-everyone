import { addAxis, addHighlightTooltip, addCircleLegend } from "../../node_modules/visual-components/index.js"
import { defaultColours as colours } from "../../colours.js"

export const addChart = (chartProps, data, colour) => {
    const { chart, width, height, margin } = chartProps

    const groups = [...new Set(data.map(d => d.country))]
    const maxRadius = height / groups.length / 2.5

    const x = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([8, width])

    const y = d3
        .scaleBand()
        .domain(groups)
        .range([0, height - 16])
        .paddingInner(1)

    const radius = d3
        .scaleSqrt()
        .domain([1, d3.max(data, d => d.expenditureShare)])
        .range([0, maxRadius])

    const getDataGroup = group =>
        data
            .filter(d => d.country === group)
            .map(d => { return { year: d.year, group: group, value: d.expenditureShare } })

    chart
        .selectAll('.lane')
        .data(groups)
        .join('g')
        .attr('class', 'lane')
        .attr('transform', group => `translate(0, ${y(group)})`)
        .call(g => g
            .append('line')
            .attr('class', 'lane-line')
            .attr('x1', x.range()[0])
            .attr('x2', x.range()[1])
            .attr('y1', y.bandwidth())
            .attr('y2', y.bandwidth())
            .attr('stroke', colours.axis)
            .attr('stroke-width', 0.5)
            .style('opacity', 0.25)
        )
        .selectAll('.data-point')
        .data(getDataGroup)
        .join('circle')
        .attr('class', 'data-point')
        .attr('r', d => radius(d.value))
        .attr('fill', d => colour(d.group))
        .style('opacity', 0.75)
        .attr('stroke', colours.axis)
        .attr('stroke-width', 0.5)
        .attr('cx', d => x(d.year))
        .attr('cy', y.bandwidth())

    addAxis({
        chart,
        height,
        width,
        colour: colours.axis,
        x,
        y,
        xFormat: d => d,
        xNumTicks: 5,
        hideXdomain: true,
        hideYdomain: true
    })

    addCircleLegend({
        chart,
        sizeScale: radius,
        colour: colours.axis,
        valuesToShow: [3, 8],
        textFormat: d => `${d}%`,
        title: 'GDP Expenditure',
        xPosition: width + margin.right / 2,
        yPosition: height + 16,
        titleFontSize: '0.8rem',
        valuesFontSize: '0.7rem'
    })

    addHighlightTooltip({
        chart,
        htmlText: d => `
        <strong>${d.group} - ${d.year}</strong>
        <div style="display: flex; justify-content: space-between">
            <span>GDP Expenditure:&emsp;</span>
            <span>${d3.format('.2f')(d.value)}%</span>
        </div>
        `,
        elements: chart.selectAll('.data-point'),
        highlightedOpacity: 1,
        fadedOpacity: 0.5,
        chartWidth: width,
        chartHeight: height
    })
}