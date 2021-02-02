import { processes } from "./process.js"
import uniqueId from "./gen-id.js"

// Compile array of objects to sequence code

const compile = instructions => {
    // Check each instruction for validity
    // Needs:
    // - id & next in correct format
    // - process number, valid
    console.log("compile start")
    for (let i of instructions) {
        console.log("for loop")
        if (!i.id || !i.id.match(/^INST[a-f0-9]{8}$/)) {
            return false
        }
        if (i.process !== 0 && (!i.next || !i.next.match(/^INST[a-f0-9]{8}$/))) {
            return false
        }
        if (!i.process && i.process !== 0) {
            return false
        }
        if (processes(i.process).id === -1) {
            return false
        }
    }
    
    console.log("all hood")

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
            if (!!instructions[i + 1] && instructions[i].next !== instructions[i + 1].id) {
                const id = uniqueId(instructions)
                const nextId = instructions[i + 1].id
                instructions.splice(i + 1, 0, {
                    id: id,
                    process: 100,
                    arguments: [`${instructions[i].next}`],
                    next: nextId
                })
                instructions[i].next = id
                // Record that jumps have been added
                jumpsChanged = true
                break
            }
        }
        console.log(instructions.length)
    }

    // ===== Offset Calculation =====
    // Assign an offset value to each instruction

    // Variable to hold cumulative offset
    let offset = 0

    // Iterate through instructions
    for (let inst of instructions) {
        // Store the current offset
        inst.offset = offset
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
                if (typeof(inst.arguments[i]) === "string" && inst.arguments[i].match(/^INST[a-f0-9]{8}$/)) {
                    // Locate the target instruction, exit if it does not exist
                    const destination = instructions.find(ins => ins.id === inst.arguments[i])
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
    const seqCode = Buffer.concat(instructions.map(inst => processes(inst.process).construct(...((!!inst.arguments && !!inst.arguments.length) ? inst.arguments : []))))

    return seqCode
}

export default compile