/*
This file conforms to ESLint linting rules: http://eslint.org/docs/user-guide/command-line-interface.
ESLine configuration is below. Here is what the numbers mean:
0 - turn the rule off
1 - turn the rule on as a warning (doesn't affect exit code)
2 - turn the rule on as an error (exit code is 1 when triggered)
*/

/* eslint-env node */
/* eslint new-cap: 0 */
/* eslint no-trailing-spaces: [2, { "skipBlankLines": true }] */
/* eslint quotes: [2, "double"] */

"use strict"

var express = require("express")
var app = express()
var staticFile = require("connect-static-file")
var bodyParser = require("body-parser")
var request = require("request")
var openscraping = require("openscraping")
var path = require("path")
var minimist = require("minimist")
var argv = minimist(process.argv.slice(2))
var apiEnabled = startContains("api")
var proxyEnabled = startContains("proxy")
var rulesUxEnabled = startContains("rules_ux")

if (!rulesUxEnabled && !apiEnabled && !proxyEnabled) {
  console.log("Please specify some modules to start. Example command line: node index.js --port 8080 --start api --start proxy --start rules_ux")
  process.exit(1)
} else if (rulesUxEnabled && (!apiEnabled || !proxyEnabled)) {
  console.log("The rules_ux will only work correctly if both api and proxy are enabled. Example command line: node index.js --port 8080 --start api --start proxy --start rules_ux")
  process.exit(1)
} else if (proxyEnabled && !apiEnabled) {
  console.log("The api needs to be enabled for the proxy to work. Example command line: node index.js --port 8080 --start api --start proxy")
  process.exit(1)
}

if (apiEnabled) {
  var port = argv.port || process.env.PORT || 8080
  var router = express.Router()

  app.use(bodyParser.text({
    type: "*/*",
    limit: "5mb"
  }))

  router.get("/", function (req, res) {
    res.json({ error: "Please select an action" })
  })

  if (proxyEnabled) {
    router.get("/proxy", function (req, res) {
      var url = req.query.url

      if (url) {
        request(url)
        .on("error", function (err) {
          res.status(400).json({ error: err })
        })
        .pipe(res)
      } else {
        res.status(400).json({ error: "Please specify a url" })
      }
    })
  }

  router.get("/evaluate", function (req, res) {
    res.json({ error: "Please use POST" })
  })

  router.post("/evaluate", function (req, res) {
    if (req.body) {
      try {
        var postData = JSON.parse(req.body)

        if (postData && postData.config && postData.html) {
          var scrapingResults = openscraping.parse(JSON.parse(postData.config), postData.html)
          res.json(scrapingResults)
        } else {
          res.status(400).json({ error: "Please send in html and config in the POST" })
        }
      } catch (e) {
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
  
  if (rulesUxEnabled) {
    app.use("/static/jsoneditor", express.static(path.join(__dirname, "/node_modules/jsoneditor/dist")))
    app.use("/static/jquery", express.static(path.join(__dirname, "/node_modules/jquery/dist")))
    app.use("/static/ace", express.static(path.join(__dirname, "/node_modules/ace-builds/src-noconflict")))
    app.use("/", staticFile(path.join(__dirname, "/index.html"), {}))
  }

  app.listen(port)
  console.log("Running on port " + port)
}

function startContains (key) {
  return argv.start && (argv.start === key || (Array.isArray(argv.start) && argv.start.indexOf(key) !== -1))
}
