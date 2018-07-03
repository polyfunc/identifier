var { URL }  = require('universal-url')
  , urljoin  = require('url-join')
  , hostname = require('./hostname')
  ;

function to_remote(protocol, host, owner, repository, options = { }) {
  let { platform } = options;

  if (!platform) {
    throw new Error('platform not specified');
  }

  switch(platform) {
    case 'github':
    case 'gitlab':
      return urljoin(`${protocol}//${host}`, owner, repository + '.git');
    case 'bitbucket':
      // https://a7medkamel@bitbucket.org/a7medkamel/bitbucket-breadboard-library.git
      return `${protocol}//${owner}@${host}/${owner}/${repository}.git`;
    default:
      throw new Error('unknown git platform');
  }
}

class Id {
  static parse(uri) {
    let { pathname, host, protocol }  = new URL(uri)
      , config                        = hostname.config(host)
      ;

    if (!config) {
      throw new Error('unknown host');
    }

    let { platform, regex } = config;

    let match = regex.exec(pathname);
    if (!match) {
      throw new Error(`not a valid route: ${pathname}`);
    }

    let owner         = match[1]
      , repository    = match[2]
      , branch        = match[3]
      , filename      = match[4]
      , remote        = to_remote(protocol, host, owner, repository, { platform })
      ;

    return {
        uri         : `${remote}#${branch}+${filename}`
      , remote
      , protocol
      , host
      , platform
      , owner
      , repository
      , branch
      , filename
    };
  }

  static run_url(uri, options = {}) {
    let { authorization, gateway = 'https://foobar.run' } = options
      , { pathname, host }                                = new URL(uri)
      ;

    let ret = new URL(urljoin(gateway, host, pathname));

    if (authorization) {
      ret.searchParams.set('Authorization', authorization);
    }

    return ret.toString();
  }
}

module.exports = Id;
