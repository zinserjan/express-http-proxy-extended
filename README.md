# express-http-proxy-extended


Express proxy middleware to forward request to another host and pass response back

## Install

```bash
$ npm install express-http-proxy-extended --save
```

## Usage

```js
var proxy = require('express-http-proxy-extended');

var app = require('express');

app.use('/proxy', proxy('www.google.com', {
  rewriteCookies: true, // rewrites secure, path & domain of received cookies
  cookiePath: '/', // default is /
  cookieDomain: '' // default is ''
}));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
```

## Licence

MIT
