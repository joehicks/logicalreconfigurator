const webPort = 44201
const wsPort = 44202
const wsType = {
    UPDATE: "update",
    SAVENODES: "savenodes",
    NODEUPDATE: "nodeupdate"
}

const defaultSequence = [
    {
        id: "INST00000000",
        process: 127,
        arguments: [],
        next: null,
        position: {
            x: 100,
            y: 100,
        },
    },
    {
        id: "INST00000001",
        process: 0,
        arguments: [],
        next: null,
        position: {
            x: 300,
            y: 100,
        },
    },
]

export {
    webPort,
    wsPort,
    wsType,
    defaultSequence
}
