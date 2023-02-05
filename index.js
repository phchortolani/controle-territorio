import { getData, getDevolucao, getOpen, getClose, Generate } from "./public/scripts/geraTerritorio.js";
import Express from "express";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = Express()
const port = process.env.PORT || 3000

app.use(Express.static('public'))

app.use(Express.json({ limit: '50mb' }));

app.get('/', (req, res) => {
    res.json(getData())
})

app.get('/getTerritory/:id', (req, res) => {

    fs.access(__dirname + `/public/assets/${req.params.id}.png`, fs.constants.F_OK, (err) => {
        if (!err) {
            res.sendFile(__dirname + `/public/assets/${req.params.id}.png`);
        } else {
            res.sendFile(__dirname + `/public/assets/notimg.png`);
        }
    });

})


app.get('/devolucao', (req, res) => {
    res.json(getDevolucao())
})
app.get('/abertos', (req, res) => {
    res.json(getOpen())
})
app.get('/fechados', (req, res) => {
    res.json(getClose())
})


app.get('/gerar', (req, res) => {
    res.json(Generate())
})

app.get('/abertos/:leader', (req, res) => {
    res.json(getOpen(req.params.leader?.toUpperCase()))
})
app.get('/fechados/:leader', (req, res) => {
    res.json(getClose(req.params.leader?.toUpperCase()))
})



app.listen(port, () => {
    console.log(`server is running: http://localhost:${port}`)
})

