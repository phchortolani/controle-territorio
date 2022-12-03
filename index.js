import { getData } from "./public/scripts/geraTerritorio.js";
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


app.listen(port, () => {
    console.log(`server is running: ${port}`)
})

