import data from "./scripts/geraTerritorio.js";
import Express from "express";

const app = Express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.json(data)
})

app.listen(port, () => {
    console.log(`server is running`)
})

