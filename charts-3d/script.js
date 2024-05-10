import { getChart } from "../components/utils.js"
import { addChart as add3dPie } from "./charts/3d-pie.js"

const data = { a: 9, b: 20, c: 30, d: 8, e: 12 }

const svgHeight = (window.innerHeight
    - document.getElementById('header').offsetHeight
    - document.getElementById('caption').offsetHeight) / 2
    - 64

add3dPie({
    chartProps: getChart(
        'chart1',
        document.getElementById('chart1-container').offsetWidth,
        svgHeight,
        {
            left: 8,
            right: 8,
            top: 8,
            bottom: 8
        }
    ),
    data,
    pieHeight: 70,
})