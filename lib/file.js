'use strict';

var Promise = require('bluebird');
var Fs       = Promise.promisifyAll(require('fs'));
var xml2js = require("xml2js");
var traverse = require('traverse');

var STDOUT_PATH = '-';
// xmljs options https://github.com/Leonidas-from-XIV/node-xml2js#options
var XML2JS_OPTS = {
  trim: true,
  normalizeTags: true,
  normalize: true,
  mergeAttrs: true
};
/**
 * Resolves if the file exists, rejects otherwise.
 * @param {String} path - path of the file to check
 * @returns {Promise}
 */
exports.exists = function (path) {
  return Fs.statAsync(path);
};

exports.existsPom = function (path) {
  return Fs.readFileAsync(path, "utf8")
          .then(function(xmlContent) {
            return xmlContent;
          })
          .then(_parseWithXml2js);
};

/**
 * Read a files contents if it exists, return the empty string otherwise.
 * @param {String} path - path of the file to read
 * @returns {Promise<String>} contents of the file
 */
exports.readIfExists = function (path) {
  return Fs.readFileAsync(path, 'utf8')
  .catch(function () {
    return '';
  });
};

/**
 * Write the data to the specified file (or to stdout if file is '-').
 * @param {String} path - path of the file to write to or '-' for stdout
 * @param {String|Buffer} data - data to write
 * @returns {Promise}
 */
exports.writeToFile = function (path, data) {
  return Promise.resolve()
  .then(function () {
    if (path === STDOUT_PATH) {
      return Fs.writeAsync(process.stdout.fd, data);
    } else {
      return Fs.writeFileAsync(path, data);
    }
  });
};

function _parseWithXml2js(xmlContent) {
  return new Promise(function(resolve, reject) {
    // parse the pom, erasing all
    xml2js.parseString(xmlContent, XML2JS_OPTS, function(err, pomObject) {
      if (err) {
        // Reject with the error
        reject(err);
      }
      // Replace the arrays with single elements with strings
      removeSingleArrays(pomObject);

      // Response to the call
      resolve(pomObject.project);
    });
  });
}

function removeSingleArrays(obj) {
  // Traverse all the elements of the object
  traverse(obj).forEach(function traversing(value) {
    // As the XML parser returns single fields as arrays.
    if (value instanceof Array && value.length === 1) {
      this.update(value[0]);
    }
  });
}
