import data from "./public/scripts/geraTerritorio.js";
import Express from "express";

const app = Express()
const port = process.env.PORT || 3000

app.use(Express.static('public'))
app.use(Express.json({ limit: '50mb' }));

app.get('/', (req, res) => {
    res.json(data)
})

app.get('/getTerritory', (req, res) => {
    res.json(data)
})

app.listen(port, () => {
    console.log(`server is running: ${port}`)
})

