// Import modules
import { allProcesses, precedenceDescriptions } from "./process.js"
import { Handle } from "react-flow-renderer"
import argTypes from "./argtypes.js"

// Create an empty object to return
const customNodes = {}

// Iterate through all processes in the process.js config file
for (const proc of allProcesses) {
    // Create a custom node element
    const node = ({ data, selected }) => {
        let invalid = false
        let needs = []
        let precludes = []
        if (data.draggingPrecedence.dragging && data.draggingPrecedence.id !== data.id) {
            const prec = data.draggingPrecedence.precedence
            for (let i = 0; i < 6; i++) {
                const mask = 2**i
                for (const p of prec) {
                    const condNeeded = !!(data.proc.needs & mask)
                    const condPrecluded = !!(data.proc.precludes & mask)
                    const condition = !!(p & mask)

                    if (condNeeded && !condition) {
                        needs.push(5 - i)
                    }

                    if (condPrecluded && condition) {
                        precludes.push(5 - i)
                    }
                    const valid =  needs.length === 0 && precludes.length === 0 //!!(data.proc.needs & p) && !(data.proc.precludes & p)
                    
                    invalid = invalid || !valid
                }
            }
        }
        return (
            <div
                style={{
                    padding: "1rem",
                    border: invalid ? "4px solid red" : `${selected ? "3" : "1"}px solid black`,
                    backgroundColor: "white",
                }}
            >
                {/* In & out handles */}
                {!proc.start ? (
                    <Handle type="target" id="in" position="left"/>
                ) : (
                    ""
                )}
                {!proc.end ? (
                    <Handle type="source" id="out" position="right" />
                ) : (
                    ""
                )}
                {/* Process title */}
                <strong>{proc.name}</strong>
                <div>{!invalid ? "" : <div style={{color: "red"}}>
                        {invalid ? <div style={{fontWeight: "bold"}}>
                            Cannot connect to this block, precedence condition unmet:
                        </div>: ""}
                        {[...needs].map(e => <div>{precedenceDescriptions.needs[e]}</div>)}
                        {[...precludes].map(e => <div>{precedenceDescriptions.precludes[e]}</div>)}
                    </div>
                }</div>
                {/* Render argument appropriately */}
                {proc.arguments.map((aType, index) => {
                    switch (aType) {
                        case argTypes.string:
                            return (
                                <div key={`${proc.id}-${index}`}>
                                    <input
                                        type="text"
                                        onChange={(e) =>
                                            data.updateArg(
                                                data.id,
                                                index,
                                                `${e.target.value}`
                                            )
                                        }
                                        value={data.getArg(data.id, index)}
                                    />
                                </div>
                            )
                        case argTypes.number:
                            return (
                                <div key={`${proc.id}-${index}`}>
                                    <input
                                        type="number"
                                        onChange={(e) =>
                                            data.updateArg(
                                                data.id,
                                                index,
                                                parseInt(e.target.value)
                                            )
                                        }
                                        value={data.getArg(data.id, index)}
                                    />
                                </div>
                            )
                        case argTypes.node:
                            return (
                                <Handle
                                    key={`${proc.id}-${index}`}
                                    type="source"
                                    id={`${index}`}
                                    position="bottom"
                                />
                            )
                        default:
                            return null
                    }
                })}                
            </div>
        )
    }

    // Add the new style to the object
    customNodes[`${proc.id}`] = node
}

export default customNodes
