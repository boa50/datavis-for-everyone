import { addChart as addSalaryByDepartment } from './charts/salary-by-department.js'
import { addChart as addSalaryByGender } from './charts/salary-by-gender.js'
import { addChart as addWeightByHeight } from './charts/weight-by-height.js'

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

    addWeightByHeight({
        data: obesity,
        chart: getChart(3),
        width: width,
        height: height,
        margin: margin,
        xAxisSelect: xAxisSelect
    })
})