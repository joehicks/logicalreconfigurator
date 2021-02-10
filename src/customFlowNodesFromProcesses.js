import { allProcesses } from "./process.js"
import { Handle } from "react-flow-renderer"
import argTypes from "./argtypes.js"

const customNodes = {}

for (const proc of allProcesses) {
    const node = ({ data }) => {
        // const outNodes =
        //     proc.arguments.filter((a) => a === argTypes.node).length + 1
        return (
            <div style={{padding: "1rem", border: "1px solid black"}}>
                <Handle type="target" id="in" position="left" />
                <Handle type="source" id="out" position="right" />

                <strong>{proc.name}</strong>
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

    customNodes[`${proc.id}`] = node
}

export default customNodes
