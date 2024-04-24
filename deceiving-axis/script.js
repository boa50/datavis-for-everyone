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

const svgHeight = (window.innerHeight - document.getElementById("header").offsetHeight) / 2 - 56
const defaultMargin = {
    left: 64,
    right: 16,
    top: 8,
    bottom: 56
}

const getChart = (id, containerId, margin = defaultMargin) => {
    const svgWidth = document.getElementById(containerId).offsetWidth

    const width = svgWidth - margin.left - margin.right
    const height = svgHeight - margin.top - margin.bottom

    const chart = d3
        .select(`#chart${id}`)
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .append('g')
        .attr('transform', `translate(${[margin.left, margin.top]})`)

    return { chart, width, height, margin }
}

const xAxisType = document.getElementById('chart-xaxis-type')
const xAxisExponent = document.getElementById('chart-xaxis-exponent')

getData().then(datasets => {
    const salaries = datasets[0]
    const obesity = datasets[1]

    addSalaryByDepartment({
        data: salaries,
        chartProps: getChart(1, 'chart1-container'),
        xAxis: {
            type: xAxisType,
            exponent: xAxisExponent
        }
    })

    addSalaryByGender({
        data: salaries,
        chartProps: getChart(2, 'chart2-container'),
        xAxis: {
            type: xAxisType,
            exponent: xAxisExponent
        }
    })

    const chart3margin = {
        ...defaultMargin,
        top: 32
    }

    addWeightByHeight({
        data: obesity,
        chartProps: getChart(3, 'chart3-container', chart3margin),
        xAxis: {
            type: xAxisType,
            exponent: xAxisExponent
        }
    })
})