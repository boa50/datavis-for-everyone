import { getChart } from "../../components/utils.js";
import { plotChart } from "./charts/line.js";

const getData = () =>
    d3.csv('./data/unemployment.csv')
        .then(d => d.map(v => { return { unemploymentRate: +v.notWorking / +v.working, measureDate: new Date(v.isoDate) } }))

const svgHeight = window.innerHeight - document.getElementById('header').offsetHeight - document.getElementById('caption').offsetHeight - 72

getData().then(data => {
    plotChart(
        getChart(
            'chart1',
            document.getElementById('chart1-container').offsetWidth,
            svgHeight
        ),
        data
    )
})