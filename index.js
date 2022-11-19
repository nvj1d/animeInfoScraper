const PORT = 5000;
const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const app = express();

async function animeArray() {
  const url = "https://myanimelist.net/anime/21/One_Piece/episode?offset=";
  myArray = [];
  for (let i = 0 ; i <= 1000; i+= 100){
    await axios(url + i).then((response) => {
        const html_data = response.data;
        const $ = cheerio.load(html_data);
        
        const selectedElem = "div.js-scrollfix-bottom-rel > div > table > tbody > tr > td > table.mt8.episode_list.js-watch-episode-list > tbody > tr.episode-list-data";
    
        const keys = [
            "No.",
            "Title", 
            "Aired",
            "vote"
        ];
    
        $(selectedElem).each((parentIndex, parentElem) => {
            let keyIndex = 0;
            const epDetails = {};
            $(parentElem).children().each((childId, childElem) => {
                let value = $(childElem).text();
                if (value) {
                    if (childId == 2){
                        value = $(childElem).find("a").text();
                    }
                    if(childId == 4){
                        value = $(childElem).find('span.value').html();
                    }
                    if(keys[keyIndex]){
                        epDetails[keys[keyIndex]] = value;
                    }
                    keyIndex++;
                }
            });
            myArray.push(epDetails);
        });
      });
  }
  return myArray;
}

app.get("/api/anime", async (req, res) => {
  try {
    const anime = await animeArray();
    
    return res.status(200).json({
      result: anime,
    });
  } catch (err) {
    return res.status(500).json({
      err: err.toString(),
    });
  }
});

app.listen(PORT, () =>
  console.log(`The server is active and running on port ${PORT}`)
);