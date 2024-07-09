import { getChart, getMargin, getChartDimensions, appendChartContainer } from '../node_modules/visual-components/index.js'
import { addChart } from './line.js'

const getData = () =>
    d3.csv('data/gdp-per-capita.csv')
        .then(d => d.map(v => { return { ...v, gdpPerCapita: +v.gdpPerCapita } }))


const allColouredId = appendChartContainer({ idNum: 1, chartTitle: 'Everything coloured' })
const allSingleFocusedId = appendChartContainer({ idNum: 2, chartTitle: 'Focusing only on one line and the others gray' })
const chosenCountriesId = appendChartContainer({ idNum: 3, chartTitle: 'A small number of countries selected and the one in focus' })
const aggRegionId = appendChartContainer({ idNum: 4, chartTitle: 'A country in focus and the others as an aggregation by region' })
const aggEconomyId = appendChartContainer({ idNum: 5, chartTitle: 'A country in focus and the others as an aggregation by economy' })
const lineLabeledId = appendChartContainer({ idNum: 6, chartTitle: 'Put the labels on the lines' })
const lineLabeledSingleColourId = appendChartContainer({ idNum: 60, chartTitle: 'Put the labels on the lines with a single colour' })
appendChartContainer({ idNum: 7, chartTitle: 'Add a message to specific data points' })


getData().then(data => {
    const dafaultMargin = getMargin({ left: 86 })
    const topLegendMargin = getMargin({ left: 86, top: 30 })
    const lineLabeledMargin = getMargin({ left: 86, right: 256 })

    addChart(
        getChart({
            id: allColouredId,
            chartDimensions: getChartDimensions({ chartId: allColouredId }),
            margin: dafaultMargin
        }),
        data.filter(d => d.group === 'country')
    )

    addChart(
        getChart({
            id: allSingleFocusedId,
            chartDimensions: getChartDimensions({ chartId: allSingleFocusedId }),
            margin: dafaultMargin
        }),
        data.filter(d => d.group === 'country'),
        { focused: 'Croatia', singleColour: true }
    )

    addChart(
        getChart({
            id: chosenCountriesId,
            chartDimensions: getChartDimensions({ chartId: chosenCountriesId }),
            margin: topLegendMargin
        }),
        data.filter(d => ['China', 'Costa Rica', 'Croatia', 'Germany', 'India', 'South Korea'].includes(d.entity)),
        { focused: 'Croatia', topLegend: true }
    )

    addChart(
        getChart({
            id: aggRegionId,
            chartDimensions: getChartDimensions({ chartId: aggRegionId }),
            margin: topLegendMargin
        }),
        data.filter(d => ['Croatia', 'Europe and Central Asia (WB)', 'Latin America and Caribbean (WB)', 'Middle East and North Africa (WB)', 'North America (WB)', 'South Asia (WB)', 'Sub-Saharan Africa (WB)'].includes(d.entity)),
        { focused: 'Croatia', topLegend: true }
    )

    addChart(
        getChart({
            id: aggEconomyId,
            chartDimensions: getChartDimensions({ chartId: aggEconomyId }),
            margin: topLegendMargin
        }),
        data.filter(d => ['Croatia', 'High-income countries', 'Low-income countries', 'Lower-middle-income countries', 'Middle-income countries', 'Upper-middle-income countries'].includes(d.entity)),
        { focused: 'Croatia', topLegend: true }
    )

    addChart(
        getChart({
            id: lineLabeledId,
            chartDimensions: getChartDimensions({ chartId: lineLabeledId }),
            margin: lineLabeledMargin
        }),
        data.filter(d => ['Croatia', 'High-income countries', 'Low-income countries', 'Lower-middle-income countries', 'Middle-income countries', 'Upper-middle-income countries'].includes(d.entity)),
        { focused: 'Croatia', lineLabel: true }
    )

    addChart(
        getChart({
            id: lineLabeledSingleColourId,
            chartDimensions: getChartDimensions({ chartId: lineLabeledSingleColourId }),
            margin: lineLabeledMargin
        }),
        data.filter(d => ['Croatia', 'High-income countries', 'Low-income countries', 'Lower-middle-income countries', 'Middle-income countries', 'Upper-middle-income countries'].includes(d.entity)),
        { focused: 'Croatia', lineLabel: true, singleColour: true }
    )
})