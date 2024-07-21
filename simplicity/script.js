import { getChart, getMargin, getChartDimensions, appendChartContainer } from '../node_modules/visual-components/index.js'
import { addChart } from './line.js'

const theme = 'dark'

const getData = () =>
    d3.csv('data/gdp-per-capita.csv')
        .then(d => d.map(v => { return { ...v, gdpPerCapita: +v.gdpPerCapita } }))


const allColouredId = appendChartContainer({ idNum: 1, chartTitle: 'GDP per Country - Everything coloured', theme })
const allSingleFocusedId = appendChartContainer({ idNum: 2, chartTitle: 'GDP per Country - Focusing only on one line and the others gray', theme })
const chosenCountriesId = appendChartContainer({ idNum: 3, chartTitle: 'GDP per Country - A small number of countries selected and the one in focus', theme })
// const aggRegionId = appendChartContainer({ idNum: 4, chartTitle: 'GDP per Country - A country in focus and the others as an aggregation by region', theme })
// const aggEconomyId = appendChartContainer({ idNum: 5, chartTitle: 'GDP per Country - A country in focus and the others as an aggregation by economy', theme })
const lineLabeledId = appendChartContainer({ idNum: 6, chartTitle: 'GDP per Country - Put the labels on the lines', theme })
const lineLabeledSingleColourId = appendChartContainer({ idNum: 60, chartTitle: 'GDP per Country - Put the labels on the lines with a single colour', theme })
const lineMessagesId = appendChartContainer({ idNum: 7, chartTitle: 'GDP per Country - Add a message to specific data points', theme })


getData().then(data => {
    const defaultMargin = getMargin({ left: 72 })
    const topLegendMargin = { ...defaultMargin, top: 30 }
    const lineLabeledMargin = { ...defaultMargin, right: 72 }

    addChart(
        getChart({
            id: allColouredId,
            chartDimensions: getChartDimensions({ chartId: allColouredId }),
            margin: defaultMargin
        }),
        data.filter(d => d.group === 'country'),
        theme
    )

    addChart(
        getChart({
            id: allSingleFocusedId,
            chartDimensions: getChartDimensions({ chartId: allSingleFocusedId }),
            margin: defaultMargin
        }),
        data.filter(d => d.group === 'country'),
        theme,
        { focused: 'Croatia', singleColour: true }
    )

    addChart(
        getChart({
            id: chosenCountriesId,
            chartDimensions: getChartDimensions({ chartId: chosenCountriesId }),
            margin: topLegendMargin
        }),
        data.filter(d => ['Croatia', 'High-income countries', 'Low-income countries', 'Lower-middle-income countries', 'Middle-income countries', 'Upper-middle-income countries'].includes(d.entity)),
        theme,
        { focused: 'Croatia', topLegend: true }
    )

    // addChart(
    //     getChart({
    //         id: aggRegionId,
    //         chartDimensions: getChartDimensions({ chartId: aggRegionId }),
    //         margin: topLegendMargin
    //     }),
    //     data.filter(d => ['Croatia', 'Europe and Central Asia (WB)', 'Latin America and Caribbean (WB)', 'Middle East and North Africa (WB)', 'North America (WB)', 'South Asia (WB)', 'Sub-Saharan Africa (WB)'].includes(d.entity)),
    //     theme,
    //     { focused: 'Croatia', topLegend: true, aggregationGroup: 'Region' }
    // )

    // addChart(
    //     getChart({
    //         id: aggEconomyId,
    //         chartDimensions: getChartDimensions({ chartId: aggEconomyId }),
    //         margin: topLegendMargin
    //     }),
    //     data.filter(d => ['Croatia', 'High-income countries', 'Low-income countries', 'Lower-middle-income countries', 'Middle-income countries', 'Upper-middle-income countries'].includes(d.entity)),
    //     theme,
    //     { focused: 'Croatia', topLegend: true, aggregationGroup: 'Income' }
    // )

    addChart(
        getChart({
            id: lineLabeledId,
            chartDimensions: getChartDimensions({ chartId: lineLabeledId }),
            margin: lineLabeledMargin
        }),
        data.filter(d => ['Croatia', 'High-income countries', 'Low-income countries', 'Lower-middle-income countries', 'Middle-income countries', 'Upper-middle-income countries'].includes(d.entity)),
        theme,
        { focused: 'Croatia', lineLabel: true }
    )

    addChart(
        getChart({
            id: lineLabeledSingleColourId,
            chartDimensions: getChartDimensions({ chartId: lineLabeledSingleColourId }),
            margin: lineLabeledMargin
        }),
        data.filter(d => ['Croatia', 'High-income countries', 'Low-income countries', 'Lower-middle-income countries', 'Middle-income countries', 'Upper-middle-income countries'].includes(d.entity)),
        theme,
        { focused: 'Croatia', lineLabel: true, singleColour: true }
    )

    addChart(
        getChart({
            id: lineMessagesId,
            chartDimensions: getChartDimensions({ chartId: lineMessagesId }),
            margin: lineLabeledMargin
        }),
        data.filter(d => ['Croatia', 'High-income countries', 'Low-income countries', 'Lower-middle-income countries', 'Middle-income countries', 'Upper-middle-income countries'].includes(d.entity)),
        theme,
        { focused: 'Croatia', lineLabel: true, singleColour: true, messages: true }
    )
})