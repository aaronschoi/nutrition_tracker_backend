const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.USDA_PORT;

app.use(cors());
app.use(express.json());

const urlMaker = (apiKey, urlType, searchTerm) => {
  const domain = "https://api.nal.usda.gov/fdc/v1/";
  switch (urlType) {
    case "single":
      return `${domain}food/${searchTerm}?api_key=${apiKey}`;
    case "multi":
      return `${domain}foods?fdcIds=${searchTerm.join(
        "&fdcIds="
      )}&api_key=${apiKey}`;
    case "singlesearch":
      const formattedUrl = `${domain}foods/search?api_key=${apiKey}`;
      if (Array.isArray(searchTerm)) {
        const formattedQuery = searchTerm[0].split(" ").join("%20");
        const formattedBrand = searchTerm[1].split(" ").join("%20");
        return `${formattedUrl}&query=${formattedQuery}&brandName=${formattedBrand}`;
      } else {
        const formattedSearch = searchTerm.split(" ").join("%20");
        return `${domain}foods/search?api_key=${apiKey}&query=${formattedSearch}`;
      }
  }
};

const extractForID = (response) => {
  const { description, fdcId, brandName, ingredients, foodNutrients, servingSize, servingSizeUnit } =
    response;

  const nutrients = foodNutrients.map((nutrient) => {
    return {
      [nutrient.nutrient
        .name]: `${nutrient.amount} ${nutrient.nutrient.unitName}`,
    };
  });

  const serving = `${servingSize} ${servingSizeUnit}`

  return {
    description,
    fdcId,
    ingredients,
    nutrients,
    brandName: brandName ? brandName : "none",
    serving
  };
};

const extractForSearch = (response) => {
  const { description, fdcId, brandName, ingredients, foodNutrients, servingSize, servingSizeUnit } =
    response;
  const nutrients = foodNutrients.map((nutrient) => {
    return {
      [nutrient.nutrientName]: `${nutrient.value} ${nutrient.unitName}`,
    };
  });
  const serving = `${servingSize} ${servingSizeUnit}`
  return {
    description,
    fdcId,
    brandName: brandName ? brandName : "none",
    ingredients,
    nutrients,
    serving
  };
};

app.post("/singleid", async (req, res) => {
  const { fdcId, apiKey } = req.body.data;
  const url = urlMaker(apiKey, "single", fdcId);
  const food = await axios.get(url).then(({ data }) => extractForID(data));
  res.json({ food });
});

app.post("/multiid", async (req, res) => {
  const { fdcId, apiKey } = req.body.data;
  const url = urlMaker(apiKey, "multi", fdcId);
  const foods = await axios.get(url).then(({ data }) => data.map(extractForID));
  res.json({ foods });
});

app.post("/singlesearch", async (req, res) => {
  const { query, apiKey, brandName } = req.body.data;
  const url = brandName
    ? urlMaker(apiKey, "singlesearch", [query, brandName])
    : urlMaker(apiKey, "singlesearch", query);
  const results = await axios
    .get(url)
    .then(({ data: { foods } }) => foods.map(extractForSearch))
    .then((array) => {
      array.splice(10);
      return array;
    });
  res.json({ results });
});

app.listen(PORT, console.log(`USDA Server running on PORT:${PORT}`));
