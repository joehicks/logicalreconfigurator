/*

process.js
-   Configure available processes

Joe Hicks | pmyjeh | 14189098
2020-12-17
The University of Nottingham

*/
const unknown = {
    id: -1,
    name: "Undefined process",
    steps: [
        "Undefined"
    ]
}

const processList = [
    {
        id: 0,
        name: "Sequence complete",
        steps: [
            "Return to flow start"
        ]
    },
    {
        id: 1,
        name: "Wait for start button press",
        steps: [
            "Await press"
        ]
    },
    {
        id: 2,
        name: "Transfer part in entry stop to test prestop",
        steps: [
            "Move transfer arm",
            "Release stop and move part to test conveyor",
            "Part travel to test prestop"
        ]
    },
    {
        id: 3,
        name: "Transfer part in test prestop to test stop",
        steps: [
            "Transfer part in test prestop to test stop"
        ]
    },
    {
        id: 7,
        name: "Transfer part in test stop to main conveyor",
        steps: [
            "Release test stop and advance transfer device",
            "Retract transfer device and part"
        ]
    },
    {
        id: 8,
        name: "Reject part in test stop",
        steps: [
            "Release test stop and start test conveyor",
            "Return test stop to closed position"
        ]
    },
    {
        id: 10,
        name: "Test depth of part in test stop",
        steps: [
            "",
            "Request depth counter reset",
            "Advance test plunger",
            "Await depth reading and retract test plunger"
        ]
    },
    {
        id: 54,
        name: "Advance main conveyor slightly",
        steps: [
            "Advance main conveyor slightly"
        ]
    },
    {
        id: 666,
        name: "name",
        steps: [
            "step1"
        ]
    },

]

export const processes = (id) => {
    // Locate the process with the correct ID
    const result = processList.find(p => p.id === id)

    // If found return process else return unknown process
    return !!result ? result : unknown
}