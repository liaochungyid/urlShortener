# URL Shortener

> A backend demo repo

Use Node.js, express and mongoDB to demonstrate an URL shortener web.
* CRUD basic operations of persistent storage
* RESTful routes design

## Table of Contents

- [Features](#features)
- [Environment Setup](#environment-setup)
- [Usage](#usage)
- [Install](#install)
- [Acknowledgments](#acknowledgments)
- [See Also](#see-also)
- [Maintainers](#maintainers)
- [License](#license)

## Features

Sep. 30 21
* User can create a new shorten URL.
* User can search(create duplicated URL) an shorten URL.
* User can use a shorten URL to redirect to the website.

## Environment Setup

1. Node.js v10.15.0
2. Other models please refer to package.json > dependencies
3. MongoDB and mongoose set as defult port: 27017. 

## Usage

Seed at Locakhost:3000
note: it will produce 3 demo urls in shortenURL(database) and shortenurls(collection). Avoid your mongoDB has the same ones.
```js
$ npm run seed
```

Start at http://localhost:3000/
```js
$ npm run start
```

Run for developing
```js
$ npm run dev
```

You might encounter an error like this
```js
$ // ReferenceError: TextEncoder is not defined
```
To fix this temporarilly, please modify file:
./node_modules/whatwg-url/dist/encoding.js
Adding the following
```js
$ "use strict";
$ let { TextEncoder, TextDecoder } = require("util"); // add this line
$ const utf8Encoder = new TextEncoder();
$ const utf8Decoder = new TextDecoder("utf-8", { ignoreBOM: true });
$ //...
```
## Install

Terminal clone
```
$ git clone https://github.com/liaochungyid/urlShortener
```

## Acknowledgments

urlShortener was inspired by [ALPHAcamp](https://tw.alphacamp.co/)

## See Also

None

## Maintainers

[CY Liao](https://github.com/liaochungyid)

## License

ISC

