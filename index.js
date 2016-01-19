var express = require("express")
var app = express()
var staticFile = require("connect-static-file")
var bodyParser = require("body-parser")
var request = require("request")
var openscraping = require("openscraping")

app.use(bodyParser.text({
  type: "*/*",
  limit: "5mb"
}))

var port = process.env.PORT || 8080

var router = express.Router()

router.get("/", function(req, res) {
    res.json({ error: "Please select an action" });
});

router.get("/proxy", function(req, res) {
    var url = req.query.url

    if (url) {
      request(url)
      .on("error", function (err) {
        res.status(400).json({ error: err })
      })
      .pipe(res)
    } else {
      res.status(400).json({ error: "Please specify a url" });   
    }
})

router.get("/evaluate", function(req, res) {
  res.json({ error: "Please use POST" });
})

router.post("/evaluate", function(req, res) {
  if (req.body) {
    try {
      var postData = JSON.parse(req.body)

      if (postData && postData.config && postData.html) {      
        scrapingResults = openscraping.parse(JSON.parse(postData.config), postData.html)
        res.json(scrapingResults)
      } else {
        res.status(400).json({ error: "Please send in html and config in the POST" })
      }
    } catch(e) {
      if (typeof e === "string") {
        res.status(400).json({ error: "There was an error while evaluating: " + e })
      } else {
        res.status(400).json({ error: "There was an error while evaluating: " + e.toString() })
      }
    }
    
  } else {
    res.status(400).json({ error: "Please send in a POST body" })
  }
})

app.use("/api", router)
app.use("/static/jsoneditor", express.static(__dirname + "/node_modules/jsoneditor/dist"))
app.use("/static/jquery", express.static(__dirname + "/node_modules/jquery/dist"))
app.use("/static/ace", express.static(__dirname + "/node_modules/ace-builds/src-noconflict"))
app.use("/", staticFile(__dirname + "/index.html", {}))

app.listen(port)
console.log("Running on port " + port)