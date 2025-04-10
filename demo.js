const express = require("express");
const app = express();
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

app.get("/form", (req, res)=>{
  res.render("./listings/demo.ejs");
});

app.post("/api", async(req,res)=>{
  try {
    let {address} = req.body;
    const response = await fetch(`https://geocode.maps.co/search?q=${address}&api_key=67efbfc5e7a34605177151sjca491fb`); // Replace with your external API URL
    const data = await response.json();
    let lat = data[0].lat;
    let lon = data[0].lon;
    res.json({lat, lon});
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});





app.listen(3000, ()=>{
  console.log("app is listening on port 3000");
})