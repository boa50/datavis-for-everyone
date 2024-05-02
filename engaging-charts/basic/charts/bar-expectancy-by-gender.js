export const addChart = (chartProps, data) => {
    const { chart, width, height } = chartProps

    const filteredData = d3.sort(data, (a, b) => d3.descending(a.average, b.average)).slice(0, 2)
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

    chart
        .selectAll('g')
        .data(filteredData)
        .join('g')
        .attr('transform', d => `translate(0, ${y(d.country)})`)
        .selectAll('rect')
        .data(getSubgroupValues)
        .join('rect')
        .attr('x', x(0))
        .attr('y', d => ySubgroup(d.subgroup))
        .attr('width', d => x(d.value))
        .attr('height', ySubgroup.bandwidth())
        .attr('fill', '#69b3a2')
}