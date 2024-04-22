import { addAxis } from '../components/axis/script.js'
import { addChart as addSalaryByDepartment } from './charts/salary-by-department.js'
import { addChart as addSalaryByGender } from './charts/salary-by-gender.js'

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

const chart3 = getChart(3)

const xAxisSelect = document.getElementById('chart-xaxis')

getData().then(datasets => {
    const salaries = datasets[0]
    const obesity = datasets[1]

    addSalaryByDepartment({
        data: salaries,
        chart: getChart(1),
        width: width,
        height: height,
        margin: margin,
        xAxisSelect: xAxisSelect
    })

    addSalaryByGender({
        data: salaries,
        chart: getChart(2),
        width: width,
        height: height,
        margin: margin,
        xAxisSelect: xAxisSelect
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