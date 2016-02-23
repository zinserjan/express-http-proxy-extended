import proxy from 'express-http-proxy';

function rewriteCookiesIntecptor(rsp, data, req, res, domain, path) {
  // intercept the response from server before sending it back to the client
  if (rsp.headers.hasOwnProperty('set-cookie')) {
    let existingCookies = rsp.headers['set-cookie'];

    if (!Array.isArray(existingCookies)) {
      existingCookies = [existingCookies];
    }

    const rewrittenCookies = existingCookies.map((cookie) => {
      let newCookie = cookie
        .replace(/(Domain)=[a-z\.-_]*?(;|$)/gi, `$1=${domain}$2`)
        .replace(/(Path)=[a-z\.-_]*?(;|$)/gi, `$1=${path}$2`);

      if (!req.connection.encrypted) {
        newCookie = newCookie.replace(/;\s*?(Secure)/i, '');
      }

      return newCookie;
    });

    res.set('set-cookie', rewrittenCookies);
  }
}

export default function expresHttpProxyExtended(host, options = {}) {
  const { cookieDomain = '', cookiePath = '/', rewriteCookies, intercept, ...forwardOptions } = options; // eslint-disable-line max-len

  const o = {
    ...forwardOptions,
    intercept: (rsp, data, req, res, callback) => {
      if (rewriteCookies === true) {
        rewriteCookiesIntecptor(rsp, data, req, res, cookieDomain, cookiePath);
      }
      if (typeof intercept === 'function') {
        intercept(rsp, data, req, res, callback);
      } else {
        callback(null, data);
      }
    },
  };

  return proxy(host, o);
}
