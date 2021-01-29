const fs = require("fs")
const asm = fs.readFileSync(process.argv[2], "utf8")

console.log(asm)