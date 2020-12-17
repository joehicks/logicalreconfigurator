// Import packages
import React, { useState, useEffect } from "react"
import { Helmet } from "react-helmet"

// Import config file
const { wsType, wsPort } = require("./config.js")

// Import process definitions
const processes = require("./process.js")

// Declare the App component
const App = () => {
    // Declare state variables for the process & step numbers
    const [process, setProcess] = useState(0)
    const [step, setStep] = useState(0)

    // Websocket connectivity
    useEffect(() => {
        // Create a new websocket client
        const ws = new WebSocket(`ws://${window.location.hostname}:${wsPort}`)

        // Handle messages
        ws.onmessage = (e) => {
            let message = {}

            // Get message object from received JSON
            try {
                message = JSON.parse(e.data)
            } catch (error) {
                console.log("Websocket message was not valid JSON")
                console.log(error)
            }
            console.log(message)
            // Operate based on message type
            switch (message.type) {
                // UPDATE type
                case wsType.UPDATE:
                    // Update process & step state
                    setProcess(processes(parseInt(message.process)))
                    setStep(parseInt(message.step))
                    break

                // Catch-all
                default:
                    console.log(
                        `Unknown Websocket message type: ${message.type}`
                    )
                    break
            }
        }
    }, [])

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
                display: "grid",
                placeItems: "center",
            }}
        >
            <Helmet title="Station Reconfiguration" />
            <div>Process {process.id} - {process.name}</div>
            <div>Step {step}</div>
        </div>
    )
}

// Export the App component
export default App
