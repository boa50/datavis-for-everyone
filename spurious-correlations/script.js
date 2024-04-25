import { getChart } from "../components/utils.js";
import { plotChart } from "./charts/awards-by-searches.js";

const svgWidth = 1080
const svgHeight = window.innerHeight / 2

plotChart(getChart(
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