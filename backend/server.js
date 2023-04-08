const path = require("path")
const express = require("express")

const app = express()

const dotenv = require("dotenv");
const envPath = path.join(__dirname, "..", "config", ".env")
console.log(dotenv.config({path: envPath}))

console.log(process.env.serhii)
console.log(process.env.olena)

const { PORT } = process.env;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})