/*

-   Server operations for Logical Reconfiguration Interface
    -   Serve web pages, as generated by React
    -   Handle MQTT Communications with PLCs


Joe Hicks | pmyjeh | 14189098
2020-12-17
The University of Nottingham

*/

// Import libraries
const mqtt = require("mqtt")
const express = require("express")
const WebSocket = require("ws")

// Import from config file
const { wsType, webPort, wsPort } = require("./src/config.js")

//
// MQTT operations
//

// Connect to MQTT broker
const mqttAddress = "localhost"
const client = mqtt.connect(`mqtt://${mqttAddress}`)

// Declare symbols for MQTT topics for easier reuse
const topics = {
    resetDepth: "dt_reset_depth",
    requestDepth: "dt_request_depth",
    reportDepth: "dt_report_depth",
    controlSiemens: "ctl_siemens",
    controlBeckhoff: "ctl_beckhoff",
    processNumbers: "pd_process_numbers",
}

// Declare an array of the topics to subscribe to
const subscriptions = [topics.reportDepth, topics.processNumbers]

// Once connection to MQTT broker is established, subscribe to the required topics
client.on("connect", function () {
    for (const sub of subscriptions) {
        client.subscribe(sub)
    }
})

// Variables to hold process data
let process = 0
let step = 0

const createMessage = (type, data) => JSON.stringify({
    type: type,
    ...data
})

// Handle incoming messages
client.on("message", function (topic, message) {
    // Decide what to do based on the received topic
    switch (topic.toString()) {
        case topics.reportDepth:
            console.log(`Depth reported: ${message.readUInt32LE()}`)
            break
        case topics.processNumbers:
            process = message.readInt16LE(0)
            step = message.readInt16LE(2)

            wss.clients.forEach((client) => {
                client.send(createMessage(wsType.UPDATE, {
                    process: process,
                    step: step
                }))
            })
            break
        default:
            break
    }
})

//
// Express app - webserving
//

// Declare an Express app
const app = express()

// Serve production React app
app.use(express.static("./build"))

app.listen(webPort, () => {
    console.log(`Backend server up on port ${webPort}`)
})

//
// Websocket server - realtime communication with interface
//

// Start Websocket
const wss = new WebSocket.Server({
    port: wsPort,
})

wss.on("connection", (ws) => {
    ws.send(createMessage(wsType.UPDATE, {
        process: process,
        step: step
    }))
})
