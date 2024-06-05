import { addAxis, addLegend, addHighlightTooltip } from "../../node_modules/visual-components/index.js"
import { palette, defaultColours as colours } from "../../colours.js"

export const addChart = (chartProps, data) => {
    const { chart, width, height, margin } = chartProps

    data = data.filter(d => d.year >= 2015)

    const groups = [...new Set(data.map(d => d.year))]
    const subgroups = [...new Set(data.map(d => d.country))]

    const getSubgroupValues = d => [''].map(v => { return { country: d.country, expenditureShare: d.expenditureShare } })


    const x = d3
        .scaleBand()
        .domain(groups)
        .range([0, width])
        .padding(.1)

    const xSubgroup = d3
        .scaleBand()
        .domain(subgroups)
        .range([0, x.bandwidth()])
        .padding(.05)

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.expenditureShare) * 1.15])
        .range([height, 0])

    const colour = d3
        .scaleOrdinal()
        .range(Object.values(palette))


    chart
        .selectAll('g')
        .data(data)
        .join('g')
        .attr('transform', d => `translate(${x(d.year)}, 0)`)
        .selectAll('rect')
        .data(getSubgroupValues)
        .join('rect')
        .attr('x', d => { console.log(d); return xSubgroup(d.country) })
        .attr('y', d => y(d.expenditureShare))
        .attr('width', xSubgroup.bandwidth())
        .attr('height', d => height - y(d.expenditureShare))
        .attr('fill', d => colour(d.country))

    addAxis({
        chart,
        height,
        width,
        colour: colours.axis,
        x,
        y,
        xFormat: d => d,
        yFormat: d => `${d}%`,
        yTickValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        xNumTicksForceInitial: true,
        hideXdomain: true,
        hideYdomain: true,
        yLabel: 'Expenditure (share of GDP)'
    })

    addLegend({
        chart,
        legends: subgroups,
        colours: Object.values(palette),
        xPosition: -margin.left,
        yPosition: -16
    })
}