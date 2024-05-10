import { getChart } from "../components/utils.js"
import { addChart as addBar } from "./charts/bar.js"
import { addChart as addPie } from "./charts/pie.js"
import { addChart as add3dPie } from "./charts/3d-pie.js"

const data = {
    'Company A': 39,
    'Our Company': 19.5,
    'Company C': 9.8,
    'Company D': 7.4,
    'Company E': 3.1,
    'Other Companies': 21.2
}

const svgHeight = (window.innerHeight
    - document.getElementById('header').offsetHeight) / 2
    - 64

addBar(
    getChart(
        'chart1',
        document.getElementById('chart1-container').offsetWidth,
        svgHeight,
        {
            left: 128,
            right: 8,
            top: 8,
            bottom: 16
        }
    ),
    data
)

addBar(
    getChart(
        'chart2',
        document.getElementById('chart2-container').offsetWidth,
        svgHeight,
        {
            left: 128,
            right: 8,
            top: 8,
            bottom: 16
        }
    ),
    data,
    'Our Company'
)

const pieProps = getChart(
    'chart3',
    document.getElementById('chart3-container').offsetWidth,
    svgHeight,
    {
        left: 8,
        right: 8,
        top: 8,
        bottom: 8
    }
)

addPie({
    chartProps: pieProps,
    data,
    radius: pieProps.height / 2.2
})

const pie3dProps = getChart(
    'chart4',
    document.getElementById('chart4-container').offsetWidth,
    svgHeight,
    {
        left: 8,
        right: 8,
        top: 8,
        bottom: 8
    }
)

add3dPie({
    chartProps: pie3dProps,
    data,
    xRadius: pie3dProps.height / 2,
    yRadius: pie3dProps.height / 2.7,
    pieHeight: pie3dProps.height / 8,
    rotation: Math.PI * 1.5
})