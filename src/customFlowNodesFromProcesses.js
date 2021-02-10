// Import modules
import { allProcesses } from "./process.js"
import { Handle } from "react-flow-renderer"
import argTypes from "./argtypes.js"

// Create an empty object to return
const customNodes = {}

// Iterate through all processes in the process.js config file
for (const proc of allProcesses) {
    // Create a custom node element
    const node = ({ data }) => {
        return (
            <div style={{padding: "1rem", border: "1px solid black"}}>
                {/* In & out handles */}
                <Handle type="target" id="in" position="left" />
                <Handle type="source" id="out" position="right" />

                {/* Process title */}
                <strong>{proc.name}</strong>

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
