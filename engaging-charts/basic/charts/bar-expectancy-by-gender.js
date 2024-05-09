import { colours } from "../../constants.js"
import { addAxis } from "../../../components/axis/script.js"
import { addLegendV2 as addLegend } from "../../../components/legend/script.js"
import { addHighlightTooltip as addTooltip } from "../../../components/tooltip/script.js"

export const addChart = (chartProps, data) => {
    const { chart, width, height, margin } = chartProps

    let filteredData = d3.sort(data, (a, b) => d3.descending(a.average, b.average))
    filteredData = [0, 3, 7, 33, 82, 176, 224].map(i => filteredData[i])
    const maxLifeExpectancy = Math.max(d3.max(filteredData, d => d.female), d3.max(data, d => d.male))
    const groups = filteredData.map(d => d.country)
    const subgroups = ['female', 'male']
    const getSubgroupValues = d => subgroups.map(subgroup => { return { subgroup: subgroup, value: d[subgroup] } })

    const x = d3
        .scaleLinear()
        .domain([0, maxLifeExpectancy * 1.05])
        .range([0, width])

    const y = d3
        .scaleBand()
        .domain(groups)
        .range([0, height])
        .padding(.1)

    const ySubgroup = d3
        .scaleBand()
        .domain(subgroups)
        .range([0, y.bandwidth()])
        .padding(.05)

    const colour = d3
        .scaleOrdinal()
        .domain(subgroups)
        .range([colours.female, colours.male])

    const countryGroups = chart
        .selectAll('g')
        .data(filteredData)
        .join('g')
        .attr('transform', d => `translate(0, ${y(d.country)})`)

    countryGroups
        .selectAll('rect')
        .data(getSubgroupValues)
        .join('rect')
        .attr('x', x(0))
        .attr('y', d => ySubgroup(d.subgroup))
        .attr('width', d => x(d.value))
        .attr('height', ySubgroup.bandwidth())
        .attr('fill', d => colour(d.subgroup))

    addAxis({
        chart,
        height,
        width,
        x,
        y,
        xLabel: 'Life Expectancy (years)',
        yLabel: 'Country',
        xNumTicks: 7,
        xNumTicksForceInitial: true,
        colour: colours.axis,
        hideXdomain: true,
        hideYdomain: true,
    })

    addLegend({
        chart,
        legends: ['Women', 'Men'],
        colours: [colours.female, colours.male],
        xPos: -margin.left,
        yPos: -margin.top
    })

    addTooltip(
        `${chart.attr('id').split('-')[0]}-container`,
        d => `
        <strong>${d.country}</strong>   
        <div style="display: flex; justify-content: space-between">
            <span>Women:&emsp;</span>
            <span>${d3.format('.1f')(d.female)} years</span>
        </div>
        <div style="display: flex; justify-content: space-between">
            <span>Men:&emsp;</span>
            <span>${d3.format('.1f')(d.male)} years</span>
        </div>
        `,
        countryGroups,
        {
            initial: 1,
            highlighted: 1,
            faded: 0.25
        }
    )
}