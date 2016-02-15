## OpenScraping API Server

[![license:isc](https://img.shields.io/badge/license-isc-brightgreen.svg?style=flat-square)](https://github.com/OpenScraping/openscraping-api-server-nodejs/blob/master/LICENSE) [![Build Status](https://img.shields.io/travis/OpenScraping/openscraping-api-server-nodejs.svg?style=flat-square)](https://travis-ci.org/OpenScraping/openscraping-api-server-nodejs) [![npm package version](https://img.shields.io/npm/v/openscraping-api-server.svg?style=flat-square)](https://www.npmjs.com/package/openscraping-api-server) [![devDependencies:?](https://img.shields.io/david/OpenScraping/openscraping-api-server-nodejs.svg?style=flat-square)](https://david-dm.org/OpenScraping/openscraping-api-server-nodejs)

The OpenScraping API server allows calling the [OpenScraping Node.js library](https://github.com/OpenScraping/openscraping-lib-nodejs/) through an HTTP API to extract information from HTML pages using a JSON config file with xPath rules.

The server provides two features:
* A JSON HTTP API that allows sending in a JSON config and an HTML page and getting back the extracted data.
* An HTML and JavaScript test console that can be accessed from the browser and which allows testing JSON configs against HTML pages.

**The server does not contain a crawler**, it just runs rules on a JSON config and HTML file sent in through an HTTP POST.

Please see the [OpenScraping Node.js library](https://github.com/OpenScraping/openscraping-lib-nodejs/) for more detailed documentation on the JSON config.

### Getting started

Install and run the API server:

```
npm install openscraping-api-server
node node_modules/openscraping-api-server/index.js --port 8080 --start api --start proxy --start rules_ux
```

Now go to [http://localhost:8080/](http://localhost:8080/) to see the test console:
<p align="center"><img src='http://i.imgur.com/MXzzuIM.jpg' alt='OpenScraping API Server Test Console' width='870'></p>

### Available components

In the *Getting Started* section above we used --start command line arguments to start the three available components. You do not need to start all of them, especially in production. Here is what these components do:

Component | Dependency | Description
--------- | ---------- | -------
api       | -          | This component runs the actual HTTP API that makes use of the [OpenScraping Node.js library](https://github.com/OpenScraping/openscraping-lib-nodejs/). See the *Accessing the API Server programatically* section below on how to use the API.
proxy     | api        | The proxy is used by the rules_ux component to download single HTML pages when users click the *Download HTML* page in the UX. **Warning**: Do not expose this server externally on the Internet when the proxy component is turned on. It could be used maliciously because it can download any HTML page accessible from the machine this server is running on. 
rules_ux  | api, proxy | This component provides the UX (see screenshot above) that allows for quick testing and development of new xPath rules against HTML pages.

### Accessing the API Server programatically

Below is sample code that assumes you have jQuery available and loaded. It should be straighforward to access the API from any other language.

```javascript
// Config containts the JSON config (as string!), and html contains the HTML of the pages we are scraping
var requestJson = JSON.stringify({ config: config, html: html })

$.post({
  url: "http://localhost:8080/api/evaluate",
  data: requestJson,
  success: function (data) {
    console.log(data)
  },
  error: function (err) {
    console.log(err)
  }
})
```
