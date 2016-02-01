
/*

  npm

*/

"use strict";


/*

  //// Dependencies

*/

var exec = require("./exec"),
    reorg = require("reorg"),
    mkdirp = require("mkdirp");




/*

  //// Exports

*/

var root = module.exports = {};


var flagLookup = {
  "global"  : "--global",
  "save"    : "--save",
  "saveDev" : "--save-dev",
};


function mapFlags(options) {

  var flags = [];

  for (var key in options)
    if (flagLookup[key] && options[key])
      flags.push(flagLookup[key])

  return flags;

}


var runCommand = reorg(function(method, command, packages, flags, next) {

  var args = [command],
      options = {};

  // Add packages
  if ("string" === typeof packages) packages = packages.split(/\s+/);
  if (packages) args = args.concat(packages);

  // Add flags
  args = args.concat(mapFlags(flags));

  // Set cwd
  if (flags.cwd) {
    options.cwd = flags.cwd;
    mkdirp.sync(options.cwd);
  }

  if ("sync" === method)
    return exec.sync("npm", args, options);
  else
    return exec.async("npm", args, options, next);

}, "string", "string", [["string", "array"], null], "object");



["install", "link", "uninstall", "unlink", "update"].forEach(function(command) {

  root[command] = function(packages, flags, next) {
    return runCommand("async", command, packages, flags, next);
  };

  root[command + "Sync"] = function(packages, flags) {
    return runCommand("sync", command, packages, flags);
  };

});

