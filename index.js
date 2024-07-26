import express from "express";
import { getvmovie, getvserie } from "./src/vidsrcto.js";
import { getfmovie, getfserie } from "./src/filemoon.js";


const port = 3000;

const app = express()

app.get('/', (req, res) => {
    res.status(200).json({
        intro: "Welcome to the unofficial vidsrc provider: check the provider website @ https://vidsrc.to/ ",
        routes: {
            movie: "/vidsrc/:movieTMDBid",
            show: "/vidsrc/:showTMDBid?s=seasonNumber&e=episodeNumber"
        },
        author: "This api is developed and created by Inside4ndroid Studios"
    });
});

app.get('/vidsrc/:tmdbId', async (req, res) => {
    const id = req.params.tmdbId;
    const season = req.query.s;
    const episode = req.query.e;

    try {
        if (season && episode) {
            const vidsrcresponse = await getvserie(id, season, episode);
            const filemoonresponse = await getfserie(id, season, episode);
            const combinedResponse = { ...filemoonresponse, ...vidsrcresponse };
            res.status(200).json(combinedResponse);
        } else {
            const vidsrcresponse = await getvmovie(id);
            const filemoonresponse = await getfmovie(id);
            const combinedResponse = { ...filemoonresponse, ...vidsrcresponse };
            res.status(200).json(combinedResponse);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});