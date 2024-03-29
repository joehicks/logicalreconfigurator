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

// Import config file
const { wsType, wsPort, webPort } = require("./config.js")

// Import process definitions
const processes = require("./process.js")

// Declare the App component
const App = () => {
    // Declare state variables for the process & step numbers
    const [process, setProcess] = useState({ steps: [] })
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
            <div>
                Process {process.id} - {process.name}
            </div>
            <div>
                {/* Display steps as visual blocks */}
                <div>
                    {(process.steps || []).map((s, i) => (
                        <StepBlock
                            active={step === i}
                            complete={step > i}
                            step={i + 1}
                        />
                    ))}
                </div>
                {/* Display step friendly text */}
                <div>{process.steps[step]}</div>
            </div>
            {/* Send a step signal to the Siemens PLC via the backend API */}
            <div>
                <a
                    href={"#"}
                    onClick={() =>
                        fetch(
                            `http://${window.location.hostname}:${webPort}/step`
                        )
                    }
                >
                    step
                </a>
            </div>
        </div>
    )
}

// Reusable component for step visual block
const StepBlock = (props) => {
    return (
        <div
            style={{
                display: "inline-grid",
                margin: 10,
                placeItems: "center",
                width: 100,
                height: 100,
                background: props.complete
                    ? "green"
                    : props.active
                    ? "yellow"
                    : "grey",
                fontSize: 40,
            }}
        >
            {props.step}
        </div>
    )
}

// Export the App component
export default App
