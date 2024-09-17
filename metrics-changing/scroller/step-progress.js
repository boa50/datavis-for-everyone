import { changeText } from "../../../node_modules/visual-components/index.js"
import { showHideTextElement } from "../utils.js"

let lastIndex = -1
let lastProgress = -1

export const handleStepProgress = ({
    response,
    explanationText,
    stepsSizes
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
            changeExplanationText('Suppose we are analysing data about homicides per country')
            break
        case 1:
            changeExplanationText('Initialy we could try to focus specifically on data related to the number of homicides, but this data can be very biased because of the differences in the number of inhabitants per country. The homicide rate could be used to take into consideration this particularity')
            break
        case 2:
            changeExplanationText('We can add a ranking position to the chart to make it easier to compare whenever changing the metric')
            break
        case 3:
            changeExplanationText('In this case we can focus on the first three countries to check how they\'ll be affected by the change')
            break
        case 4:
            changeExplanationText('When changing the metric to the Homicide Rate, we can see that only the first two countries are still present on the new chart and a bunch of countries with lower ranks within the number of homicides metric show up now')
            break
        case 5:
            changeExplanationText('So, depending on the information that must be conveyed and how people\' behaviour should be influenced different perspectives could be presented')
            break
        default:
            break
    }
    // changeExplanationText('Pre Ending Step', true, false)

    lastIndex = currentIndex
    lastProgress = currentProgress === 0 ? -1 : currentProgress
}