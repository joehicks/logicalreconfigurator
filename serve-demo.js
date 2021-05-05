const app = require("express")()
const webPort = 44201
// Serve production React app
app.use(express.static("./build"))

// Parse JSON bodies

app.listen(webPort, () => {
    console.log(`Backend server up on port ${webPort}`)
})