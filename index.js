'use strict';

var path = require('path');
var gutil = require('gulp-util');
var through2 = require('through2');

var pluginName = 'gulp-concat-style';

function toObject(arr) {
  var result = {}
  for (var i = 0; i < arr.length; i++) {
    result[arr[i]] = i;
  };
  return result;
}

var entryKeyworkRegex = /\<([^\>]+)\>/g;
var outputKeyworkRegex = /\[([^\]]+)\]/g;


module.exports = function(option) {
  if (!option.entry || typeof option.entry !== 'string') {
    throw new gutil.PluginError(pluginName, 'option entry is required! type is string.')
  }
  if (!option.output || typeof option.output !== 'string') {
    throw new gutil.PluginError(pluginName, 'option output is required! type is string.')
  }
  
  if (!entryKeyworkRegex.test(option.entry)) {
    throw new gutil.PluginError(pluginName, 'option entry not has <> variable!')
  }

  var entryVarIndex = []
  var ruleRegex = option.entry.replace(entryKeyworkRegex, function(input, $1) {
    entryVarIndex.push($1);
    return '(.+)';
  });
  entryVarIndex = toObject(entryVarIndex);
  ruleRegex = new RegExp(ruleRegex);

  var outputFiles = {};

  return through2.obj(function(file, env, cb) {
    var filename = path.basename(file.path);
    var filenamePathParse = ruleRegex.exec(filename);

    if (filenamePathParse) {
      filenamePathParse.splice(0, 1);

      var outputFilename = option.output;
      if (outputKeyworkRegex.test(option.output)) {
        outputFilename = option.output.replace(outputKeyworkRegex, function(input, keywork) {
          return filenamePathParse[entryVarIndex[keywork]] || 'default';
        })
      }

      if (!outputFiles[outputFilename]) {
        outputFiles[outputFilename] = [];
      }
      outputFiles[outputFilename].push({
        name: filename,
        file: file
      });
      cb()
    } else {
      cb()
    }
  }, function(cb) {
    var filesName = Object.keys(outputFiles);

    if (filesName.length === 0) {
      return cb();
    }

    for (var i = 0; i < filesName.length; i++) {
      var filename = filesName[i]
      var concatFiles = outputFiles[filename];
      var concatFirstFile = concatFiles[0].file;

      var concatFileContents = concatFiles.map(function(fileObj) {
        var desc = '/** file: ' + fileObj.name + ' **/\n'
        return desc + fileObj.file.contents.toString();
      }).join(gutil.linefeed);

      var concatenatedFile = new gutil.File({
        base: concatFirstFile.base,
        cwd: concatFirstFile.cwd,
        path: path.join(concatFirstFile.base, filename),
        contents: new Buffer(concatFileContents)
      });
      
      this.push(concatenatedFile);
      
      gutil.log(gutil.colors.magenta(pluginName), 'concat a style file:', gutil.colors.green(filename), concatFileContents.length, 'bytes')
    };

    cb();
  })
};
