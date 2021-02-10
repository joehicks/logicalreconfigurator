// Function to create an ID
const id = () => `INST${Math.round((Math.random() * 0xffffffff)).toString(16)}`

const uniqueId = instructions => {
    let newId = id()
    // Ensure ID is unique
    // eslint-disable-next-line
    while (!!instructions.find(inst => inst.id === newId)) {
        newId = id()
    }
    return newId
}

export default uniqueId