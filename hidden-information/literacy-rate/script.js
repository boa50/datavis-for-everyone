import { appendChartContainer } from "../../node_modules/visual-components/index.js"

const getData = () =>
    d3.csv('data/dataset.csv')
        .then(d => d.map(v => { return { ...v, literacyRate: +v.literacyRate } }))

const literacyRateId = appendChartContainer({ idNum: 0, chartTitle: 'Literacy Rate' })

getData().then(data => {
    console.log(data);

})