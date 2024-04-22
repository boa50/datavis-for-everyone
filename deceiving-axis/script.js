import { addAxis } from '../components/axis/script.js'
import { addChart as addSalaryDepartment } from './charts/salary-by-department.js'

const getData = () =>
    Promise.all([
        d3.csv('./data/Employee_Salaries.csv')
            .then(d => d.map(v => {
                return {
                    ...v,
                    Base_Salary: +v.Base_Salary
                }
            })),
        d3.csv('./data/Obesity_Data_Sinthetic.csv')
            .then(d => d.map(v => {
                return {
                    ...v,
                    Height: +v.Height,
                    Weight: +v.Weight
                }
            }))
    ])

const svgWidth = Math.floor(window.innerWidth / 2)
const svgHeight = Math.floor(window.innerHeight / 2)
const margin = {
    left: 64,
    right: 72,
    top: 16,
    bottom: 64
}

const width = svgWidth - margin.left - margin.right
const height = svgHeight - margin.top - margin.bottom

const getChart = id => d3
    .select(`#chart${id}`)
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .append('g')
    .attr('transform', `translate(${[margin.left, margin.top]})`)

const chart2 = getChart(2)
const chart3 = getChart(3)

const xAxisSelect = document.getElementById('chart-xaxis')

getData().then(datasets => {
    const salaries = datasets[0]
    const obesity = datasets[1]

    addSalaryDepartment({
        data: salaries,
        chart: getChart(1),
        width: width,
        height: height,
        margin: margin,
        xAxisSelect: xAxisSelect
    })




    //Chart 2
    const groupedData2 = d3
        .flatRollup(salaries, v => d3.median(v, x => x.Base_Salary), d => d.Gender)
        .sort((a, b) => a[1] - b[1])

    const x2 = d3
        .scalePow()
        .domain([0, d3.max(groupedData2, d => d[1])])
        .range([0, width])
        .exponent(10)

    const y2 = d3
        .scaleBand()
        .domain(groupedData2.map(d => d[0]))
        .range([height, 0])
        .padding(0.2)

    chart2
        .selectAll('.bars')
        .data(groupedData2)
        .join('rect')
        .attr('x', x2(0))
        .attr('y', d => y2(d[0]))
        .attr('width', d => x2(d[1]))
        .attr('height', y2.bandwidth())
        .attr('fill', '#69b3a2')

    addAxis({
        chart: chart2,
        height: height,
        width: width,
        margin: margin,
        x: x2,
        y: y2
    })


    //Chart 3
    const x3 = d3
        .scaleLinear()
        .domain(d3.extent(obesity, d => d.Weight))
        .range([0, width])

    const y3 = d3
        .scaleLinear()
        .domain(d3.extent(obesity, d => d.Height))
        .range([height, 0])

    chart3
        .selectAll('.points')
        .data(obesity)
        .join('circle')
        .attr('cx', d => x3(d.Weight))
        .attr('cy', d => y3(d.Height))
        .attr('r', 3)
        .attr('fill', '#69b3a2')
        .style('opacity', 0.75)
        .attr('stroke', '#6b7280')
        .attr('stroke-width', 0.5)

    addAxis({
        chart: chart3,
        height: height,
        width: width,
        margin: margin,
        x: x3,
        y: y3
    })
})