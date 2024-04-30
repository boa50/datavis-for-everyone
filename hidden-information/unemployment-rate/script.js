import { getChart } from "../../components/utils.js";
import { plotChart as plotLine } from "./charts/line.js";
import { plotChart as plotStackedArea } from "./charts/stacked-area.js";

const getData = () =>
    d3.csv('./data/unemployment.csv')
        .then(d => d.map(v => {
            return {
                measureDate: new Date(v.isoDate + 'T03:00:00Z'),
                working: +v.working * 1e3,
                notWorking: +v.notWorking * 1e3,
                outOfWorkforce: +v.outOfWorkforce * 1e3,
                unemploymentRate: +v.notWorking / (+v.working + +v.notWorking)
            }
        }))

const svgHeight = (window.innerHeight
    - document.getElementById('header').offsetHeight
    - document.getElementById('caption').offsetHeight) / 2
    - 64

getData().then(data => {
    plotLine(
        getChart(
            'chart1',
            document.getElementById('chart1-container').offsetWidth,
            svgHeight
        ),
        data
    )

    plotStackedArea(
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
        data
    )
})