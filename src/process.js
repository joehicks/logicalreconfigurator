/*

process.js
-   Configure available processes

Joe Hicks | pmyjeh | 14189098
2020-12-17
The University of Nottingham

*/
// Import argument types
import argTypes from "./argtypes.js"

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
        steps: ["Return to flow start"],
        needs: 0b000000,
        procludes: 0b000000,
        sets: 0b000000,
        clears: 0b000000,
        arguments: [],
    },
    {
        id: 1,
        name: "Wait for start button press",
        steps: ["Await press"],
        needs: 0b000000,
        procludes: 0b000000,
        sets: 0b000000,
        clears: 0b000000,
        arguments: [],
    },
    {
        id: 2,
        name: "Transfer part in entry stop to test prestop",
        steps: [
            "Move transfer arm",
            "Release stop and move part to test conveyor",
            "Part travel to test prestop",
        ],
        needs: 0b001000,
        procludes: 0b000000,
        sets: 0b000100,
        clears: 0b001000,
        arguments: [],
    },
    {
        id: 3,
        name: "Transfer part in test prestop to test stop",
        steps: ["Transfer part in test prestop to test stop"],
        needs: 0b000100,
        procludes: 0b000000,
        sets: 0b000010,
        clears: 0b000100,
        arguments: [],
    },
    {
        id: 4,
        name: "Exit on main line from entry stop",
        steps: [],
        needs: 0b001000,
        procludes: 0b000000,
        sets: 0b100000,
        clears: 0b001000,
        arguments: [],
    },
    {
        id: 7,
        name: "Transfer part in test stop to main conveyor",
        steps: [
            "Release test stop and advance transfer device",
            "Retract transfer device and part",
        ],
        needs: 0b000010,
        procludes: 0b000000,
        sets: 0b100000,
        clears: 0b000010,
        arguments: [],
    },
    {
        id: 8,
        name: "Reject part in test stop",
        steps: [
            "Release test stop and start test conveyor",
            "Return test stop to closed position",
        ],
        needs: 0b000010,
        procludes: 0b000000,
        sets: 0b100000,
        clears: 0b000010,
        arguments: [],
    },
    {
        id: 10,
        name: "Test depth of part in test stop",
        steps: [
            "",
            "Request depth counter reset",
            "Advance test plunger",
            "Await depth reading and retract test plunger",
        ],
        needs: 0b000010,
        procludes: 0b000000,
        sets: 0b000001,
        clears: 0b000000,
        arguments: [],
    },
    {
        id: 11,
        name: "Record test data",
        steps: [],
        needs: 0b010001,
        procludes: 0b000000,
        sets: 0b000000,
        clears: 0b000000,
        arguments: [],
    },
    {
        id: 20,
        name: "Wait for barcode",
        steps: [],
        needs: 0b100000,
        procludes: 0b000000,
        sets: 0b000000,
        clears: 0b000000,
        arguments: [],
    },
    {
        id: 21,
        name: "Store latest barcode",
        steps: [],
        needs: 0b100000,
        procludes: 0b000000,
        sets: 0b010000,
        clears: 0b000000,
        arguments: [],
    },
    {
        id: 54,
        name: "Advance main conveyor slightly",
        steps: ["Advance main conveyor slightly"],
        needs: 0b100000,
        procludes: 0b000000,
        sets: 0b000000,
        clears: 0b000000,
        arguments: [],
    },
    {
        id: 100,
        name: "Jump",
        hide: true,
        steps: [],
        needs: 0b000000,
        procludes: 0b000000,
        sets: 0b000000,
        clears: 0b000000,
        arguments: [argTypes.node],
        length: 4,
        construct: (to) => {
            const buf = Buffer.alloc(4)
            buf[0] = 100
            buf[1] = 4
            buf.writeInt16BE(to, 2)
            return buf
        },
    },
    {
        id: 101,
        name: "Jump if depth GT",
        steps: [],
        needs: 0b000001,
        procludes: 0b000000,
        sets: 0b000000,
        clears: 0b000000,
        arguments: [argTypes.number, argTypes.node],
        length: 8,
        construct: (compare, to) => {
            const buf = Buffer.alloc(8)
            buf[0] = 101
            buf[1] = 8
            buf.writeUInt32BE(compare, 2)
            buf.writeInt16BE(to, 6)
            return buf
        },
    },
    {
        id: 102,
        name: "Jump if barcode matches",
        steps: [],
        needs: 0b000001,
        procludes: 0b000000,
        sets: 0b000000,
        clears: 0b000000,
        arguments: [argTypes.string, argTypes.node],
        length: 13,
        construct: (compare, to) => {
            const buf = Buffer.alloc(13)
            buf[0] = 102
            buf[1] = 13
            buf[10] = 0
            buf.write(compare, 2)
            buf.writeInt16BE(to, 11)
            return buf
        },
    }
]

const defaultConstructor = (id) => () => Buffer.from([id, 2])

// Export the full process list without constructors
export const allProcesses = processList

// Export a processes function
export const processes = (id) => {
    // Locate the process with the correct ID
    const result = processList.find(p => p.id === id)

    // If no constructor or length use default
    if (!!result && !result.construct) {
        result.construct = defaultConstructor(id)
    }
    if (!!result && !result.length) {
        result.length = 2
    }

    // If found return process else return unknown process
    return !!result ? result : unknown
}