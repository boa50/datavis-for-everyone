import { addChart as addSalaryByDepartment } from './charts/salary-by-department.js'
import { addChart as addSalaryByGender } from './charts/salary-by-gender.js'
import { addChart as addWeightByHeight } from './charts/weight-by-height.js'
import { handleInputChange } from '../components/html/slider/script.js'

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

const svgHeight = (window.innerHeight - document.getElementById("header").offsetHeight) / 2 - 74
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
handleInputChange({ target: xAxisExponent })

getData().then(datasets => {
    const salaries = datasets[0]
    const obesity = datasets[1]

    const updateSalaryByDepartment = addSalaryByDepartment(
        salaries, getChart(1, 'chart1-container')
    )

    const updateSalaryByGender = addSalaryByGender(
        salaries, getChart(2, 'chart2-container')
    )

    const chart3margin = {
        ...defaultMargin,
        top: 32
    }

    const updateWeightByHeight = addWeightByHeight(
        obesity, getChart(3, 'chart3-container', chart3margin)
    )

    const updateCharts = () => {
        updateSalaryByDepartment(xAxisType.value, xAxisExponent.value)
        updateSalaryByGender(xAxisType.value, xAxisExponent.value)
        updateWeightByHeight(xAxisType.value, xAxisExponent.value)
    }

    xAxisType.addEventListener('change', () => { updateCharts() })
    xAxisExponent.addEventListener('change', () => { xAxisType.value === 'pow' ? updateCharts() : null })
})