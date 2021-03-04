const express = require("express"), 
app = express(), 
port = process.env.PORT || 5500,
bodyParser = require("body-parser"),
cors = require("cors"), 
scrapers = require("./scrapers");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.json());
app.use(cors());

app.listen(port, () =>
  console.log(`JobScrape listening at http://localhost:${port}`)
);

app.get("/", (req, res)=>{
  res.send("API up and running")
});

app.post("/something", async (req, res) => {
  console.log("something endpoint", req.body);
  try{
    const jobData = await scrapers.scrapeChannel(req.body.customURL, req.body.techInput);
    res.send(jobData);
  }
  catch(error){
    console.log(error)
  }
});
