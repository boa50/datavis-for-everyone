import { getChart, getMargin } from '../node_modules/visual-components/index.js'
import { addChart as addLine } from './charts/line.js'

const getData = () =>
    d3.csv('data/education-investing.csv')
        .then(d => d.map(v => { return { ...v, expenditureShare: +v.expenditureShare } }))


getData().then(data => {
    addLine(
        getChart({
            id: 'chart1',
            margin: getMargin({ right: 80 })
        }),
        data
    )
})