// Import modules
import { allProcesses, precedenceDescriptions } from "./process.js"
import { Handle } from "react-flow-renderer"
import argTypes from "./argtypes.js"
import { checkPrecedenceIntoProcess } from "./checkPrecedence.js"

// Create an empty object to return
const customNodes = {}

// Iterate through all processes in the process.js config file
for (const proc of allProcesses) {
    // Create a custom node element
    const node = ({ data, selected }) => {
        let invalid = false
        let needs = []
        let precludes = []

        let unmet = []

        if (data.draggingPrecedence.dragging && data.draggingPrecedence.id !== data.id) {
            unmet = checkPrecedenceIntoProcess(data.draggingPrecedence.precedence, data.proc)
            invalid = unmet.length > 0
        }
        return (
            <div
                style={{
                    padding: "1rem",
                    border: invalid ? "4px solid #ddd" : `${selected ? "3" : "1"}px solid black`,
                    backgroundColor: "white",
                    color: invalid ? "#888" : "inherit"
                }}
            >
                {/* In & out handles */}
                {!proc.start ? (
                    <Handle type="target" id="in" position="left" style={invalid ? 
                        {display: "grid", placeItems: "center", cursor: "not-allowed"} :
                    {}}>
                        {invalid ? <img src="no.svg" alt="Cannot connect to this node" style={{margin: "-0.5rem", height: "1rem"}}/> : ""}
                    </Handle>
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
                <div>{!invalid ? "" : <div style={{color: "#666"}}>
                        {invalid ? <div style={{fontWeight: "bold"}}>
                            Cannot connect to this block, precedence condition unmet:
                        </div>: ""}
                        {[...unmet].map(un => <div>{un}</div>)}
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
