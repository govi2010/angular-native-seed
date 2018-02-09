
const queryString = require('query-string');
import { AnimationCurve } from 'ui/enums';
import { LoadEventData, WebView } from "tns-core-modules/ui/web-view";
const nodeUrl = require('url-parse');
const generateRandomString = function (length) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

export default (config, webview: WebView, routerExtension) => {
  let getAuthorizationCode = (opts) => {
    opts = opts || {};

    if (!config.redirectUri) {
      config.redirectUri = 'urn:ietf:wg:oauth:2.0:oob';
    }

    let urlParams: any = {
      response_type: 'code',
      redirect_uri: config.redirectUri,
      client_id: config.clientId,
      state: generateRandomString(16)
    };

    if (opts.scope) {
      urlParams.scope = opts.scope;
    }

    if (opts.accessType) {
      urlParams.access_type = opts.accessType;
    }

    let url = config.authorizationUrl + '?' + queryString.stringify(urlParams);

    return new Promise((resolve, reject) => {
      const authWindow: WebView = webview;

      // authWindow.show();
      authWindow.src = url;

      let onCallback = (url) => {
        // debugger;
        let url_parts: any = nodeUrl(url, true);
        console.log(JSON.stringify(url));
        let query = url_parts.query;
        let code = query.code;
        let error = query.error;

        if (error !== undefined) {
          reject(error);
          routerExtension.navigate(['/login'], {
            clearHistory: true, animated: true,
            transition: {
              name: 'slideRight',
              curve: AnimationCurve.ease
            }
          });
        } else if (code) {
          resolve(code);
          routerExtension.navigate(['/login'], {
            clearHistory: true, animated: true,
            transition: {
              name: 'slideRight',
              curve: AnimationCurve.ease
            }
          });
        }
      }

      authWindow.on('loadStarted', (event: LoadEventData) => {
        console.log()
        onCallback(event.url);
      });

      // authWindow.on('loadFinished', (event: LoadEventData) => {
      //   onCallback(event.url);
      // });
    });
  }

  let tokenRequest = (data) => {
    let header: any = {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    if (config.useBasicAuthorizationHeader) {
      header.Authorization = 'Basic ' + new Buffer(config.clientId + ':' + config.clientSecret).toString('base64');
    } else {
      Object.assign(data, {
        client_id: config.clientId,
        client_secret: config.clientSecret
      });
    }

    return fetch(config.tokenUrl, {
      method: 'POST',
      headers: header,
      body: queryString.stringify(data)
    }).then(function (res) {
      return res.json();
    });
  }

  let getAccessToken = (opts) => {
    return getAuthorizationCode(opts)
      .then(function (authorizationCode) {
        let tokenRequestData = {
          code: authorizationCode,
          grant_type: 'authorization_code',
          redirect_uri: config.redirectUri
        };
        tokenRequestData = Object.assign(tokenRequestData, opts.additionalTokenRequestData);
        return tokenRequest(tokenRequestData);
      });
  }

  let refreshToken = (refreshToken) => {
    return tokenRequest({
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
      redirect_uri: config.redirectUri
    });
  }

  return {
    getAuthorizationCode: getAuthorizationCode,
    getAccessToken: getAccessToken,
    refreshToken: refreshToken
  };
};
