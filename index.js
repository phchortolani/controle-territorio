import data from "./public/scripts/geraTerritorio.js";
import Express from "express";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = Express()
const port = process.env.PORT || 3000

app.use(Express.static('public'))

app.use(Express.json({ limit: '50mb' }));

app.get('/', (req, res) => {
    res.json(data)
})

app.get('/getTerritory/:id', (req, res) => {
    res.sendFile(__dirname + `/public/assets/${req.params.id}.png`);
})

app.listen(port, () => {
    console.log(`server is running: ${port}`)
})

