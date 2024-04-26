import { getChart } from "../components/utils.js";
import { plotChart as plotAwardsBySearches } from "./charts/awards-by-searches.js";
import { plotChart as plotGdpVsHappiness } from "./charts/gdp-vs-happiness.js";
import { plotChart as plotGdpHappinessByYear } from "./charts/gdp-&-happiness-by-year.js";

const svgHeight = window.innerHeight / 2

plotAwardsBySearches(getChart(
    'chart1',
    document.getElementById('chart1-container').offsetWidth,
    svgHeight,
    {
        left: 64,
        right: 64,
        top: 8,
        bottom: 56
    }
))

plotGdpVsHappiness(
    getChart(
        'chart2',
        document.getElementById('chart2-container').offsetWidth,
        svgHeight,
        {
            left: 64,
            right: 16,
            top: 32,
            bottom: 56
        }
    ),
    false
)

plotGdpVsHappiness(
    getChart(
        'chart3',
        document.getElementById('chart3-container').offsetWidth,
        svgHeight,
        {
            left: 64,
            right: 16,
            top: 32,
            bottom: 56
        }
    )
)

const countriesSelector = document.getElementById('chart4-countries')
const countries = ['China']

plotGdpHappinessByYear(
    getChart(
        'chart4',
        document.getElementById('chart4-container').offsetWidth,
        svgHeight,
        {
            left: 64,
            right: 64,
            top: 32,
            bottom: 56
        }
    ),
    countries,
    countriesSelector
)