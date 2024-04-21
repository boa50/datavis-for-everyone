let x1

const plotChart = chart => {

}

export const addChart = ({ data, chart }) => {
    //Chart 1
    const groupedData1 = d3
        .flatRollup(salaries, v => d3.median(v, x => x.Base_Salary), d => d.Department)
        .sort((a, b) => a[1] - b[1])

    const groupedDataFiltered1 = [
        ...groupedData1.slice(0, 3),
        ...groupedData1.slice(Math.floor(groupedData1.length / 2) - 1, Math.floor(groupedData1.length / 2) + 2),
        ...groupedData1.slice(groupedData1.length - 4, groupedData1.length - 1)
    ]

    x1 = d3
        .scaleLog()
        .domain([1, d3.max(groupedDataFiltered1, d => d[1])])
        .range([0, width])

    chart1Axis.addEventListener('change', event => {
        const scale = event.target.value

        switch (scale) {
            case 'linear':
                x1 = d3
                    .scaleLinear()
                    .domain([0, d3.max(groupedDataFiltered1, d => d[1])])
                    .range([0, width])
                chart1
                    .selectAll('.bars')
                    .data(groupedDataFiltered1)
                    .join('rect')
                    .attr('class', 'bars')
                    .attr('x', x1(0))
                    .attr('y', d => y1(d[0]))
                    .attr('width', d => x1(d[1]))
                    .attr('height', y1.bandwidth())
                    .attr('fill', '#69b3a2')

                addAxis({
                    chart: chart1,
                    height: height,
                    width: width,
                    margin: margin,
                    x: x1,
                    y: y1
                })
                break;
            case 'log':
                x1 = d3
                    .scaleLog()
                    .domain([1, d3.max(groupedDataFiltered1, d => d[1])])
                    .range([0, width])
                chart1
                    .selectAll('.bars')
                    .data(groupedDataFiltered1)
                    .join('rect')
                    .attr('class', 'bars')
                    .attr('x', x1(0))
                    .attr('y', d => y1(d[0]))
                    .attr('width', d => x1(d[1]))
                    .attr('height', y1.bandwidth())
                    .attr('fill', '#69b3a2')
                addAxis({
                    chart: chart1,
                    height: height,
                    width: width,
                    margin: margin,
                    x: x1,
                    y: y1
                })
                break;
            case 'pow':
                x1 = d3
                    .scalePow()
                    .domain([10, d3.max(groupedDataFiltered1, d => d[1])])
                    .range([0, width])
                chart1
                    .selectAll('.bars')
                    .data(groupedDataFiltered1)
                    .join('rect')
                    .attr('class', 'bars')
                    .attr('x', x1(0))
                    .attr('y', d => y1(d[0]))
                    .attr('width', d => x1(d[1]))
                    .attr('height', y1.bandwidth())
                    .attr('fill', '#69b3a2')
                break;
        }
    })

    const y1 = d3
        .scaleBand()
        .domain(groupedDataFiltered1.map(d => d[0]))
        .range([height, 0])
        .padding(0.2)

    chart1
        .selectAll('.bars')
        .data(groupedDataFiltered1)
        .join('rect')
        .attr('class', 'bars')
        .attr('x', x1(0))
        .attr('y', d => y1(d[0]))
        .attr('width', d => x1(d[1]))
        .attr('height', y1.bandwidth())
        .attr('fill', '#69b3a2')

    addAxis({
        chart: chart1,
        height: height,
        width: width,
        margin: margin,
        x: x1,
        y: y1
    })
}