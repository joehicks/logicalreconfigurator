const id = () => `INST${Math.round((Math.random() * 0xffffffff)).toString(16)}`

const uniqueId = instructions => {
    let newId = id()
    while (!!instructions.find(inst => inst.id === newId)) {
        newId = id()
    }

    return newId
}

export default uniqueId