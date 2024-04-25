import { getChart } from "../components/utils.js";
import { plotChart as plotAwardsBySearches } from "./charts/awards-by-searches.js";
import { plotChart as plotGdpVsHappiness } from "./charts/gdp-vs-happiness.js";

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
        svgHeight
    )
)