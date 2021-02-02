import compile from "./compile.js"

import fs from "fs"

const instructions = [
    {
        id: "INST00000001",
        process: 1,
        next: "INST00000002"
    },
    {
        id: "INST00000002",
        process: 20,
        next: "INST00000003"
    },
    {
        id: "INST00000003",
        process: 21,
        next: "INST00000010"
    },
    {
        id: "INST00000010",
        process: 102,
        arguments: ["3333****", "INST00000011"],
        next: "INST00000004"
    },
    {
        id: "INST00000011",
        process: 4,
        next: "INST00000000"
    },
    {
        id: "INST00000004",
        process: 2,
        next: "INST00000005"
    },
    {
        id: "INST00000005",
        process: 3,
        next: "INST00000012"
    },
    {
        id: "INST00000012",
        process: 102,
        arguments: ["3331****", "INST00000013"],
        next: "INST00000006"
    },
    {
        id: "INST00000013",
        process: 8,
        next: "INST00000000"
    },
    {
        id: "INST00000006",
        process: 10,
        next: "INST00000015"
    },
    {
        id: "INST00000015",
        process: 11,
        next: "INST00000007"
    },
    {
        id: "INST00000007",
        process: 101,
        arguments: [471, "INST00000008"],
        next: "INST00000009"
    },
    {
        id: "INST00000009",
        process: 7,
        next: "INST0000000a"
    },
    {
        id: "INST0000000a",
        process: 54,
        next: "INST00000000"
    },
    {
        id: "INST00000008",
        process: 8,
        next: "INST00000000"
    },
    {
        id: "INST00000000",
        process: 100,
        arguments: ["INST00000001"],
        next: "INST00000020"
    },
    {
        id: "INST00000020",
        process: 0,
        next: "INSTaaaaaaaa"
    }
]

const i2 = [
    {
        id: "INST00000001",
        process: 1,
        next: "INST00000002"
    },
    {
        id: "INST00000002",
        process: 20,
        next: "INST00000002"
    },
    {
        id: "INST00000000",
        process: 0,
        next: "INSTaaaaaaaa"
    }
]

fs.writeFileSync("./newprog.hex", compile(instructions))