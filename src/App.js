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
import ReactFlow, { Controls } from "react-flow-renderer"
import uniqueId from "./gen-id"

// Import custom React Flow nodes
import customNodes from "./customFlowNodesFromProcesses"

// Import argument types
import argTypes from "./argtypes"

// Import process details etc. from config
import { processes, allProcesses } from "./process"
import { wsType } from "./config"

// Declare the App component
const App = () => {
    // State to hold the sequence array
    const [sequence, setSequence] = useState([])

    // State to hold the array that drives React Flow
    const [flow, setFlow] = useState([])

    //
    // Websocket handling
    //

    // State to hold WebSocket connection
    const [ws, setWs] = useState(null)

    // Function to save latest sequence to server
    const saveSequence = (seq) => {
        seq = seq || sequence
        ws.send(
            JSON.stringify({
                type: wsType.SAVENODES,
                sequence: seq,
            })
        )
    }

    // On load, instatiate WebSocket connection
    useEffect(() => {
        // Create WS connection
        const newWs = new WebSocket(`${window.location.protocol.replace(/http/, "ws")}//${window.location.host}/ws`)
        // Handle incoming messages
        newWs.addEventListener("message", function (event) {
            let message = {}
            // Read as JSON, handle errors
            try {
                message = JSON.parse(event.data)
            } catch (e) {
                return console.log(
                    "Garbled message received:",
                    message,
                    " | Could not parse JSON | ",
                    e
                )
            }
            // Act depending on message type
            switch (message.type) {
                case wsType.NODEUPDATE:
                    if (!message.sequence) return
                    setSequence(message.sequence)
                    break
                default:
                    break
            }
        })
        // Store this websocket connection to state
        setWs(newWs)
    }, [])

    //
    // Functions to modify sequence array state
    //

    // Update an argument
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
        saveSequence(seq)
    }

    // Retrieve an argument
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

    // Set an instruction's next property
    const setNext = (id, next) => {
        const seq = [...sequence]
        const node = seq.find((s) => s.id === id)
        if (!node) {
            return console.log(`No node with id = ${id}`)
        }
        node.next = next
        setSequence(seq)
        saveSequence(seq)
    }

    // Add a new instruction
    const addNew = (id) => {
        const seq = [...sequence]
        seq.push({
            id: uniqueId(sequence),
            next: null,
            arguments: processes(id).arguments.map((a) => null),
            process: id,
        })
        setSequence(seq)
        saveSequence(seq)
    }

    const updatePosition = (id, pos) => {
        const seq = [...sequence]
        const node = seq.find((s) => s.id === id)
        if (!node) {
            return console.log(`No node with id = ${id}`)
        }
        node.position = pos
        setSequence(seq)
        saveSequence(seq)
    }

    // Runs every time the sequence array state changes to update the flow state
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
            // TODO: Smarter positioning
            position: s.position || { x: 100, y: 100 },
        }))

        // Extract edges from the sequence array
        const edges = []

        // Style for edges
        const edgeStyle = {}

        for (const s of sequence) {
            // Pull expected arguments for each instructions
            const procArgs = processes(s.process).arguments
            // Iterate through the instruction's arguments
            for (let i = 0; i < s.arguments.length; i++) {
                // Find the node arguments
                if (procArgs[i] === argTypes.node && !!s.arguments[i]) {
                    // Add to the edges array if required
                    edges.push({
                        id: `${s.id}${i}-${s.arguments[i]}in`,
                        source: s.id,
                        sourceHandle: `${i}`,
                        target: s.arguments[i],
                        targetHandle: "in",
                        style: edgeStyle,
                    })
                }
            }
            // If there is no next property then skip
            if (!s.next) {
                continue
            }
            // Add an edge
            edges.push({
                id: `${s.id}out-${s.next}in`,
                source: s.id,
                sourceHandle: "out",
                target: s.next,
                targetHandle: "in",
                style: edgeStyle,
            })
        }
        // Update the state
        setFlow([...nodes, ...edges])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sequence])

    // Handling selection and removal of nodes & edges
    const [selection, setSelection] = useState([])

    const removeSelection = () => {
        let seq = [...sequence]
        for (const sel of selection) {
            if (!!sel.source && !!sel.target) {
            } else {
                const id = sel.id
                const index = seq.findIndex((s) => s.id === id)
                if (index < 0) {
                    return console.log(`No node with id = ${id}`)
                }
                seq.splice(index, 1)
                seq = seq.map((inst) => {
                    inst.next = inst.next === id ? null : inst.next
                    inst.arguments = inst.arguments.map((arg) =>
                        arg === id ? null : arg
                    )
                    return inst
                })
            }
        }
        setSequence(seq)
        saveSequence(seq)
    }

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
            }}
        >
            {/* Change tab title */}
            <HelmetProvider>
                <Helmet title="Station Reconfiguration" />
            </HelmetProvider>

            {/* Sidebar */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "#eeeeee",
                    zIndex: 100,
                    padding: "1rem",
                }}
            >
                {/* Build from processes */}
                {allProcesses
                    .filter((p) => !p.hide)
                    .map((p, i) => (
                        <div
                            key={`processlist${i}`}
                            onClick={() => addNew(p.id)}
                        >
                            {p.name}
                        </div>
                    ))}
                    <div onClick={() => removeSelection()}>DELETE</div>
            </div>

            {/* React Flow element */}
            <ReactFlow
                // Use custom nodes
                nodeTypes={customNodes}
                // Populate with elements in the flow state
                elements={flow}
                // When a connection is made update the sequence state
                onConnect={(params) => {
                    if (params.sourceHandle === "out") {
                        setNext(params.source, params.target)
                    } else {
                        updateArg(
                            params.source,
                            parseInt(params.sourceHandle),
                            params.target
                        )
                    }
                }}
                onNodeDragStop={(e, node) => {
                    updatePosition(node.id, node.position)
                }}
                onSelectionChange={setSelection}
            >
                <Controls/>
            </ReactFlow>
        </div>
    )
}

// Export the App component
export default App
