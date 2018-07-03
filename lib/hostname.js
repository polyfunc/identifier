var _ = require('lodash');

function custom_config(hostname) {
  // remove dep on config for web
  let config = require('config');
  if (_.has(config, `git.hosts`)) {
    return _.find(config.get(`git.hosts`), { hostname });
  }
}

function config(hostname) {
  switch(hostname) {
    case 'github.run':
    case 'www.github.run':
    case 'github.com':
      return require('./host/github');
    case 'gitlab.run':
    case 'www.gitlab.run':
    case 'gitlab.com':
      return require('./host/gitlab');
    case 'bitbucket.run':
    case 'www.bitbucket.run':
    case 'bitbucket.com':
      return require('./host/bitbucket');
    default:
      let ret = custom_config(hostname);
      if (ret) {
        let { regex, host, platform } = ret;

        return { regex, host, platform };
      }
  }
}

module.exports = {
  config
}
