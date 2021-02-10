/*

App.js
-   Frontend React app

Joe Hicks | pmyjeh | 14189098
2020-12-17
The University of Nottingham

*/

// Import packages
import React, { useState, useEffect } from "react"
import { Helmet, HelmetProvider } from "react-helmet-async"
import ReactFlow from "react-flow-renderer"

// Import custom React Flow nodes
import customNodes from "./customFlowNodesFromProcesses"
import argTypes from "./argtypes"

// Import process details from config
import { processes } from "./process"

// Declare the App component
const App = () => {
    const [sequence, setSequence] = useState([
        {
            id: "INST00000010",
            process: 102,
            arguments: ["3333****", null],
            next: "INST00000007",
        },
        {
            id: "INST00000007",
            process: 101,
            arguments: [471, "INST00000010"],
            next: null,
        },
    ])

    const [flow, setFlow] = useState([])

    const updateArg = (id, arg, value) => {
        const seq = [...sequence]
        const node = seq.find((s) => s.id === id)
        if (!node) {
            return console.log(`No node with id = ${id}`)
        }
        if (!node.arguments) {
            return console.log("No arguments required")
        }
        if (node.arguments.length <= arg) {
            return console.log("Argument out of range")
        }
        node.arguments[arg] = value

        setSequence(seq)
    }

    const getArg = (id, arg) => {
        const node = sequence.find((s) => s.id === id)
        if (!node) {
            return console.log(`No node with id = ${id}`)
        }
        if (!node.arguments) {
            return console.log("No arguments")
        }
        if (node.arguments.length <= arg) {
            return console.log("Argument out of range")
        }
        return node.arguments[arg]
    }

    const setNext = (id, next) => {
        const seq = [...sequence]
        const node = seq.find((s) => s.id === id)
        if (!node) {
            return console.log(`No node with id = ${id}`)
        }
        node.next = next
        setSequence(seq)
    }

    useEffect(() => {
        // Convert the sequence array into an array of nodes
        const nodes = sequence.map((s) => ({
            id: s.id,
            type: `${s.process}`,
            data: {
                updateArg: updateArg,
                getArg: getArg,
                id: s.id,
            },
            position: { x: 100, y: 100 },
        }))

        // Extract edges from the sequence array
        const edges = []
        for (const s of sequence) {
            const procArgs = processes(s.process).arguments
            for (let i = 0; i < s.arguments.length; i++) {
                if (procArgs[i] === argTypes.node && !!s.arguments[i]) {
                    edges.push({
                        id: `${s.id}${i}-${s.arguments[i]}in`,
                        source: s.id,
                        sourceHandle: `${i}`,
                        target: s.arguments[i],
                        targetHandle: "in",
                    })
                }
            }
            if (!s.next) {
                continue
            }
            edges.push({
                id: `${s.id}out-${s.next}in`,
                source: s.id,
                sourceHandle: "out",
                target: s.next,
                targetHandle: "in",
            })
        }
        setFlow([...nodes, ...edges])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sequence])

    // JSX to render App component
    return (
        <div
            className="App"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                fontSize: 40,
                // display: "grid",
                // placeItems: "center",
            }}
        >
            {/* Change tab title */}
            <HelmetProvider>
                <Helmet title="Station Reconfiguration" />
            </HelmetProvider>
            {/* Display process ID and name */}

            <pre style={{ fontSize: 10 }}>
                {JSON.stringify(sequence, null, 4)}
            </pre>
            <ReactFlow
                nodeTypes={customNodes}
                elements={flow}
                onConnect={(params) => {
                    console.log(params)
                    if (params.sourceHandle === "out") {
                        setNext(params.source, params.target)
                    }
                }}
            />
        </div>
    )
}

// Export the App component
export default App
