import { processes } from "./process.js"
import uniqueId from "./gen-id.js"

// Compile array of objects to sequence code

const compile = (instr, dry, mappings) => {
    // Create a copy of the instructions to work on
    let instructions = JSON.parse(JSON.stringify(instr))
    // Check we have one process start and one process complete
    if (instructions.filter((i) => i.process === 0).length !== 1) {
        console.error(
            "Compilation requires exactly one Sequence Complete instruction"
        )
        return false
    }
    if (instructions.filter((i) => i.process === 127).length !== 1) {
        console.error(
            "Compilation requires exactly one Process Start instruction"
        )
        return false
    }
    // Check each instruction for validity
    // Needs:
    // - id & next in correct format
    // - process number, valid
    console.log("Compile start")
    console.log(instructions)
    for (let i of instructions) {
        //console.log("Checking", i.id)
        if (!i.id || !i.id.match(/^INST[a-f0-9]{8}$/)) {
            console.error("Invalid ID found: ", i.id)
            return false
        }
        if (
            i.process !== 0 &&
            (!i.next || !i.next.match(/^INST[a-f0-9]{8}$/))
        ) {
            console.error("Following process missing in", i.id)
            return false
        }
        if (!i.process && i.process !== 0) {
            console.error("No process number stated in", i.id)
            return false
        }
        if (processes(i.process).id === -1) {
            console.error(
                "Invalid process number stated in",
                i.id,
                ":",
                i.process
            )
            return false
        }
    }

    console.log("Initial tests passed")
    if (dry) return true

    // ===== Start and finish index correction =====
    // Move start process to start and end to end
    const endInst = instructions.splice(
        instructions.findIndex((i) => i.process === 0),
        1
    )[0]
    instructions.push(endInst)

    const startInst = instructions.splice(
        instructions.findIndex((i) => i.process === 127),
        1
    )[0]
    instructions.unshift(startInst)

    // ===== Jump Insertion =====

    // Track whether jumps have been added in this pass
    let jumpsChanged = true

    // Whilst jumps keep being added, iterate over the instructions
    // and add jumps where required
    while (jumpsChanged) {
        jumpsChanged = false
        // Iterate through the instruction array
        for (let i = 0; i < instructions.length - 1; i++) {
            // If the next instruction in the array is not the desired next instruction insert a jump
            if (
                !!instructions[i + 1] &&
                instructions[i].next !== instructions[i + 1].id
            ) {
                const id = uniqueId(instructions)
                const nextId = instructions[i + 1].id
                instructions.splice(i + 1, 0, {
                    id: id,
                    process: 100,
                    arguments: [`${instructions[i].next}`],
                    next: nextId,
                })
                instructions[i].next = id
                // Record that jumps have been added
                jumpsChanged = true
                break
            }
        }
    }

    // ===== Offset Calculation =====
    // Assign an offset value to each instruction

    // Variable to hold cumulative offset
    let offset = 0

    // Object of offset to instruction ids
    const map = {}

    // Iterate through instructions
    for (let inst of instructions) {
        // Store the current offset
        inst.offset = offset
        map[offset] = inst.id
        // Update the next offset value
        offset += processes(inst.process).length
    }

    // ===== Address Offset Insertion =====
    // Replace instruction addresses with their true offset

    // Iterate through the instructions
    for (let inst of instructions) {
        // If there is a valid arguments array
        if (!!inst.arguments && !!inst.arguments.length) {
            // Iterate through the arguments
            for (let i = 0; i < inst.arguments.length; i++) {
                // If the argument is a valid instruction id
                if (
                    typeof inst.arguments[i] === "string" &&
                    inst.arguments[i].match(/^INST[a-f0-9]{8}$/)
                ) {
                    // Locate the target instruction, exit if it does not exist
                    const destination = instructions.find(
                        (ins) => ins.id === inst.arguments[i]
                    )
                    if (!destination) {
                        return false
                    }
                    // Replace the instruction id with the offset
                    inst.arguments[i] = destination.offset
                }
            }
        }
    }

    // ===== Sequence Code Construction =====
    // Use the process construct functions to generate sequence code

    // Create a buffer of sequence code from the instructions array
    const seqCode = Buffer.concat(
        instructions.map((inst) =>
            processes(inst.process).construct(
                ...(!!inst.arguments && !!inst.arguments.length
                    ? inst.arguments
                    : [])
            )
        )
    )
    if (mappings) {
        return {
            seq: seqCode,
            map: map
        }
    }
    return seqCode
}

export default compile
