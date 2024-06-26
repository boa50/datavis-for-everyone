import { addAxis, addLegend, addHighlightTooltip as addTooltip } from '../../../node_modules/visual-components/index.js'
import { colours } from '../../constants.js'

export const addChart = (chartProps, data) => {
    const { chart, width, height, margin } = chartProps

    let filteredData = d3.sort(data, (a, b) => d3.descending(a.average, b.average))
    filteredData = [0, 3, 7, 33, 82, 176, 224].map(i => filteredData[i])
    const maxLifeExpectancy = Math.max(d3.max(filteredData, d => d.female), d3.max(data, d => d.male))
    const groups = filteredData.map(d => d.country)

    const x = d3
        .scaleLinear()
        .domain([0, maxLifeExpectancy * 1.05])
        .range([0, width])

    const y = d3
        .scaleBand()
        .domain(groups)
        .range([0, height])
        .padding(.1)

    const getYposition = d => y(d.country) + y.bandwidth() / 2

    const lollipopGroups = chart
        .selectAll('.lollipop-group')
        .data(filteredData)
        .join('g')
        .attr('class', 'lollipop-group')
        .call(g => {
            g
                .append('line')
                .attr('x1', d => x(Math.min(d.male, d.female)))
                .attr('x2', d => x(Math.max(d.male, d.female)))
                .attr('y1', getYposition)
                .attr('y2', getYposition)
                .attr('stroke', colours.axis)
                .attr('stroke-width', 1)

            g
                .append('circle')
                .attr('cx', d => x(d.male))
                .attr('cy', getYposition)
                .attr('r', 5)
                .style('fill', colours.male)

            g
                .append('circle')
                .attr('cx', d => x(d.female))
                .attr('cy', getYposition)
                .attr('r', 5)
                .style('fill', colours.female)

            g
                .append('text')
                .attr('x', d => x(Math.min(d.male, d.female)) - 12)
                .attr('y', getYposition)
                .attr('text-anchor', 'end')
                .attr('dominant-baseline', 'middle')
                .attr('cursor', 'default')
                .style('font-size', '0.85rem')
                .attr('fill', colours.axis)
                .text(d => d.country)
        })


    addAxis({
        chart,
        height,
        width,
        x,
        xLabel: 'Life Expectancy (years)',
        xNumTicks: 7,
        xNumTicksForceInitial: true,
        colour: colours.axis
    })

    addLegend({
        chart,
        legends: ['Men', 'Women'],
        colours: [colours.male, colours.female],
        xPosition: -margin.left
    })

    addTooltip({
        chart,
        htmlText: d => `
        <strong>${d.country}</strong>
        <div style='display: flex; justify-content: space-between'>
            <span>Men:&emsp;</span>
            <span>${d3.format('.1f')(d.male)} years</span>
        </div>
        <div style='display: flex; justify-content: space-between'>
            <span>Women:&emsp;</span>
            <span>${d3.format('.1f')(d.female)} years</span>
        </div>
        `,
        elements: lollipopGroups,
        initialOpacity: 1
    })
}