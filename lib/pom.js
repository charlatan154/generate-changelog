'use strict';

var File           = require('./file');
var ParseGitHubUrl = require('github-url-from-git');
var path           = require('path');

/**
 * Get the pom.xml object located in the current directory.
 * @returns {Promise<Object>} pom.xml
 */
exports.getUserPom = function () {
  var userPomPath = path.join(process.cwd(), 'pom.xml');
  return File.existsPom(userPomPath).catch(function () {
    throw new Error('valid pom.xml not found');
  });
};

/**
 * Grabs the repository URL if it exists in the package.json.
 * @returns {Promise<String|Null>} the repository URL or null if it doesn't exist
 */
exports.extractRepoUrl = function () {
  return exports.getUserPom()
  .then(function (userPackage) {
    //console.log(userPackage);
    var url = userPackage.repository && userPackage.repository.url;

    if (typeof url !== 'string') {
      return null;
    }

    if (url.indexOf('github') === -1) {
      return url;
    } else {
      return ParseGitHubUrl(url);
    }
  });
};

/**
 * Calculate the new semver version depending on the options.
 * @param {Object} options - calculation options
 * @param {Boolean} options.patch - whether it should be a patch version
 * @param {Boolean} options.minor - whether it should be a minor version
 * @param {Boolean} options.major - whether it should be a major version
 * @returns {Promise<String>} - new version
 */
exports.calculateNewVersion = function (options) {
  options = options || {};
  return exports.getUserPom()
  .then(function (userPackage) {
    //console.log(userPackage);
    var split = userPackage.version.split('.');

    if (options.major) {
      split[0] = (parseInt(split[0]) + 1).toString();
      split[1] = '0';
      split[2] = '0';
    } else if (options.minor) {
      split[1] = (parseInt(split[1]) + 1).toString();
      split[2] = '0';
    } else if (options.patch) {
      split[2] = (parseInt(split[2]) + 1).toString();
    }

    return split.join('.');
  });
};