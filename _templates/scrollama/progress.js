import { changeText, showText } from "../../node_modules/visual-components/index.js"
import { showHideTextElement } from "./utils.js"

export const handleStepProgress = ({
    response,
    explanationText,
    stepsSizes,
    updateChart1,
    updateChart2
}) => {
    const currentIndex = response.index
    const currentProgress = response.progress

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
            showText(explanationText)
            break
        case 1:
            changeExplanationText('First Step', false)
            updateChart1()
            break
        case 2:
            changeExplanationText('Second Step')
            updateChart2()
            break
        default:
            break
    }
}