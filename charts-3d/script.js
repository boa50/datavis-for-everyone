import { getChart } from "../node_modules/visual-components/index.js"
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
    getChart({
        id: 'chart1',
        svgHeight,
        margin: {
            left: 128,
            right: 8,
            top: 8,
            bottom: 16
        },
        chartDimensions: {}
    }),
    data
)

addBar(
    getChart({
        id: 'chart2',
        svgHeight,
        margin: {
            left: 128,
            right: 8,
            top: 8,
            bottom: 16
        },
        chartDimensions: {}
    }),
    data,
    'Our Company'
)

const pieProps = getChart({
    id: 'chart3',
    svgHeight,
    margin: {
        left: 8,
        right: 8,
        top: 8,
        bottom: 8
    },
    chartDimensions: {}
})

addPie({
    chartProps: pieProps,
    data,
    radius: pieProps.height / 2.2
})

const pie3dProps = getChart({
    id: 'chart4',
    svgHeight,
    margin: {
        left: 8,
        right: 8,
        top: 8,
        bottom: 8
    },
    chartDimensions: {}
})

add3dPie({
    chartProps: pie3dProps,
    data,
    xRadius: pie3dProps.height / 2,
    yRadius: pie3dProps.height / 2.7,
    pieHeight: pie3dProps.height / 8,
    rotation: Math.PI * 1.5
})