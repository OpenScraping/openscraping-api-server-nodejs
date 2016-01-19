## OpenScraping API Server

The OpenScraping API server allows using the [OpenScraping Node.js library](https://github.com/zmarty/openscraping-lib-nodejs/) to extract information from HTML pages using a JSON config file with xPath rules.

The server provides two features:
* A JSON HTTP API that allows sending in a JSON config and an HTML page and getting back the extracted data.
* An HTML and JavaScript test console that can be accessed from the browser and which allows testing JSON configs against HTML pages.

### Getting started

Install and run the API server:

```
npm install openscraping-api-server
node node_modules/openscraping-api-server/index.js
```

Now go to [http://localhost:8080/](http://localhost:8080/) to see the test console:
<p align="center"><img src='http://i.imgur.com/AvpwGCK.jpg' alt='OpenScraping API Server Test Console' width='870'></p>
