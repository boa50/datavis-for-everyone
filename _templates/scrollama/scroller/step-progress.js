import { changeText } from "../../../node_modules/visual-components/index.js"
import { showHideTextElement } from "../utils.js"

let lastIndex = 0
let lastProgress = 0

export const handleStepProgress = ({
    response,
    explanationText,
    stepsSizes,
    updateChart1,
    updateChart2
}) => {
    const currentIndex = response.index
    const currentProgress = response.progress
    const currentDirection = currentIndex > lastIndex ? 'down' : currentProgress > lastProgress ? 'down' : 'up'

    const changeExplanationText = (txt, executeShow = true, executeHide = true) => {
        changeText(explanationText, txt)
        showHideTextElement({
            element: explanationText,
            stepSize: stepsSizes[currentIndex],
            progress: currentProgress,
            executeShow,
            executeHide
        })
    }

    // Start the animation only after the first step
    switch (currentIndex) {
        case 0:
            break
        case 1:
            changeExplanationText('First Step')
            updateChart1()
            break
        case 2:
            changeExplanationText('Second Step')
            updateChart2()
            break
        case 3:
            changeExplanationText('Pre Ending Step', true, false)
            break
        default:
            break
    }

    lastIndex = currentIndex
    lastProgress = currentProgress
}