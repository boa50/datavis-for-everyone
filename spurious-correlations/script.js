import { getChart } from "../node_modules/visual-components/index.js";
import { plotChart as plotAwardsBySearches } from "./charts/awards-by-searches.js";
import { plotChart as plotGdpVsHappiness } from "./charts/gdp-vs-happiness.js";
import { plotChart as plotGdpHappinessByYear, updateChart as updateGdpHappinessByYear } from "./charts/gdp-&-happiness-by-year.js";

const getData = () =>
    d3.csv('./data/gdp-vs-happiness-cleansed.csv')
        .then(d => d.map(v => {
            return {
                ...v,
                gdpPerCapita: +v.gdpPerCapita,
                lifeSatisfaction: +v.lifeSatisfaction
            }
        }))

const svgHeight = window.innerHeight / 2

plotAwardsBySearches(
    getChart({
        id: 'chart1',
        svgHeight,
        margin: {
            left: 64,
            right: 64,
            top: 8,
            bottom: 56
        },
        chartDimensions: {}
    })
)

plotGdpVsHappiness(
    getChart({
        id: 'chart2',
        svgHeight,
        margin: {
            left: 64,
            right: 16,
            top: 32,
            bottom: 56
        },
        chartDimensions: {}
    }),
    false
)

plotGdpVsHappiness(
    getChart({
        id: 'chart3',
        svgHeight,
        margin: {
            left: 64,
            right: 16,
            top: 32,
            bottom: 56
        },
        chartDimensions: {}
    })
)

const countriesSelector = document.getElementById('chart4-countries')
const countries = ['China']

getData().then(gdpVsHappinesData => {
    const gdpHappinessByYearChart = getChart({
        id: 'chart4',
        svgHeight,
        margin: {
            left: 64,
            right: 64,
            top: 48,
            bottom: 56
        },
        chartDimensions: {}
    })

    const gdpHappinessByYearObject = plotGdpHappinessByYear(
        gdpVsHappinesData,
        gdpHappinessByYearChart,
        countries
    )

    // Filling the select box with all countries names
    const allCountries = [...new Set(gdpVsHappinesData.map(d => d.country))].sort()
    countriesSelector.innerHTML = allCountries
        .map(country => `<option value="${country}" ${countries.includes(country) ? 'selected' : null}>${country}</option>`)
    countriesSelector.loadOptions()

    // Updating the chart when the list of selected countries change
    countriesSelector.addEventListener('change', function (event) {
        for (let option of event.target.options) {
            if (option.selected
                && !countries.includes(option.value))
                countries.push(option.value)

            if (!option.selected
                && countries.includes(option.value))
                countries.splice(countries.indexOf(option.value), 1)
        }

        updateGdpHappinessByYear({ ...gdpHappinessByYearObject, countries: countries })
    })
})
