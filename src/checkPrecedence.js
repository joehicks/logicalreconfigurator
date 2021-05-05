import { precedenceDescriptions } from "./process.js"

const conditionCount = precedenceDescriptions.needs.length

export const checkPrecedenceIntoProcess = (precedence, process) => {
    const conditionsUnmet = []
    for (let i = 0; i < conditionCount; i++) {
        const mask = 2 ** i
        for (const p of precedence) {
            const condNeeded = !!(process.needs & mask)
            const condPrecluded = !!(process.precludes & mask)
            const condition = !!(p & mask)

            if (condNeeded && !condition) {
                conditionsUnmet.push(
                    precedenceDescriptions.needs[conditionCount - 1 - i]
                )
            }

            if (condPrecluded && condition) {
                conditionsUnmet.push(
                    precedenceDescriptions.needs[conditionCount - 1 - i]
                )
            }
        }
    }

    return conditionsUnmet.reduce((a, c) => {
        if (!a.includes(c)) a.push(c)
        return a
    }, [])
}
