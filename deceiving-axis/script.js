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

const svgWidth = Math.floor(window.innerWidth / 3.15)
const svgHeight = Math.floor(window.innerHeight / 2.35)
const margin = {
    left: 64,
    right: 16,
    top: 8,
    bottom: 56
}

const width = svgWidth - margin.left - margin.right
const height = svgHeight - margin.top - margin.bottom

const getChart = (id, svgWidth, customMargin = margin) => d3
    .select(`#chart${id}`)
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .append('g')
    .attr('transform', `translate(${[customMargin.left, customMargin.top]})`)

const xAxisType = document.getElementById('chart-xaxis-type')
const xAxisExponent = document.getElementById('chart-xaxis-exponent')

getData().then(datasets => {
    const salaries = datasets[0]
    const obesity = datasets[1]

    addSalaryByDepartment({
        data: salaries,
        chart: getChart(1, svgWidth),
        width: width,
        height: height,
        margin: margin,
        xAxis: {
            type: xAxisType,
            exponent: xAxisExponent
        }
    })

    addSalaryByGender({
        data: salaries,
        chart: getChart(2, svgWidth),
        width: width,
        height: height,
        margin: margin,
        xAxis: {
            type: xAxisType,
            exponent: xAxisExponent
        }
    })

    const chart3margin = {
        ...margin,
        top: 32
    }
    const chart3height = svgHeight - chart3margin.top - chart3margin.bottom

    addWeightByHeight({
        data: obesity,
        chart: getChart(3, svgWidth * 2.025, chart3margin),
        width: width * 2.15,
        height: chart3height,
        margin: chart3margin,
        xAxis: {
            type: xAxisType,
            exponent: xAxisExponent
        }
    })
})