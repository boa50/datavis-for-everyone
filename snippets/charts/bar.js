const HORIZONTAL_BARS = () => {
    const x = d3
        .scaleLinear()
        .domain([0, MAX_VALUE])
        .range([0, width])

    const y = d3
        .scaleBand()
        .domain(data.map(d => d.GROUP_FIELD))
        .range([0, height])
        .padding(.1)

    chart
        .selectAll('.myRect')
        .data(data)
        .join('rect')
        .attr('x', x(0))
        .attr('y', d => y(d.GROUP_FIELD))
        .attr('width', d => x(d.VALUE))
        .attr('height', y.bandwidth())
        .attr('fill', '#69b3a2')
}

const GROUPED_HORIZONTAL_BARS = () => {
    const getSubgroupValues = d => SUBGROUPS.map(subgroup => { return { subgroup: subgroup, value: d[subgroup] } })

    const x = d3
        .scaleLinear()
        .domain([0, MAX_VALUE])
        .range([0, width])

    const y = d3
        .scaleBand()
        .domain(GROUPS)
        .range([0, height])
        .padding(.1)

    const ySubgroup = d3
        .scaleBand()
        .domain(SUBGROUPS)
        .range([0, y.bandwidth()])
        .padding(.05)

    chart
        .selectAll('g')
        .data(data)
        .join('g')
        .attr('transform', d => `translate(0, ${y(d.GROUP_FIELD)})`)
        .selectAll('rect')
        .data(getSubgroupValues)
        .join('rect')
        .attr('x', x(0))
        .attr('y', d => ySubgroup(d.subgroup))
        .attr('width', d => x(d.value))
        .attr('height', ySubgroup.bandwidth())
        .attr('fill', '#69b3a2')
}