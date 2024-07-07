import { getChart, appendChartContainer, getChartDimensions } from '../../../node_modules/visual-components/index.js'
import { palette } from '../../../colours.js'

const chart1Id = appendChartContainer({ idNum: 10, chartTitle: 'Score distribution', outerContainerClass: 'bg-neutral-950 px-4 py-2 rounded-sm' })
await new Promise(r => setTimeout(r, 0));

const { chart, width, height } = getChart({
    id: chart1Id,
    chartDimensions: getChartDimensions({ chartId: chart1Id }),
    margin: { left: 0, right: 0, top: 8, bottom: 8 }
})

console.log(getChartDimensions({ chartId: chart1Id }));

chart.attr('transform', `translate(${[width / 2, height / 2]})`)

const pieData = d3
    .pie()
    .value(d => d[1])
    .sort((a, b) => (a, b))
    (Object.entries({ academic: 55, employability: 20, other: 25 }))

const colour = d3
    .scaleOrdinal()
    .range([palette.vermillion, palette.bluishGreen, '#171717'])

const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(150)

chart
    .selectAll('.my-slices')
    .data(pieData)
    .join('path')
    .attr('d', arc)
    .attr('fill', d => colour(d.data[0]))
    .attr('stroke', 'white')
    .style('stroke-width', '1px')
    .style('opacity', 0.9)