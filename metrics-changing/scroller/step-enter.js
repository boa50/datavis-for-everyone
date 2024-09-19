import { changeText, showTextTransition, changeTextTransition } from "../../node_modules/visual-components/index.js"

export const handleStepEnter = ({
    response,
    chartTitle,
    updateChartFunctions
}) => {
    const currentIndex = response.index
    const currentDirection = response.direction

    const changeTitleText = (txt, transition = true) => {
        if (transition) {
            changeTextTransition(chartTitle, `<span class="font-medium">${txt}</span>`, 1000, 'changeTitle')
        } else {
            changeText(chartTitle, `<span class="font-medium">${txt}</span>`)
        }
    }

    switch (currentIndex) {
        case 0:
            manageDirection({
                currentDirection,
                down: () => {
                    updateChartFunctions().plotInitial()
                    showTextTransition(chartTitle, 1000)
                    changeTitleText('Number of Homicides per Country', false)
                }
            })
            break
        case 1:
            manageDirection({
                currentDirection,
                up: updateChartFunctions().hideRanking
            })
            break
        case 2:
            manageDirection({
                currentDirection,
                down: updateChartFunctions().showRanking,
                up: updateChartFunctions().defaultBarColour
            })
            break
        case 3:
            manageDirection({
                currentDirection,
                down: updateChartFunctions().highlightBarColour,
                up: () => {
                    updateChartFunctions().plotHomicideNumber()
                    updateChartFunctions().showRanking()
                    updateChartFunctions().highlightBarColour()
                    changeTitleText('Number of Homicides per Country')
                }
            })
            break
        case 4:
            manageDirection({
                currentDirection,
                down: () => {
                    updateChartFunctions().plotHomicideRate()
                    updateChartFunctions().showRanking()
                    changeTitleText('Homicide Rate per Country')
                }
            })
            break
        default:
            break
    }
}

function manageDirection({ currentDirection, up = () => { }, down = () => { } }) {
    if (currentDirection === 'down') down()
    else up()
}