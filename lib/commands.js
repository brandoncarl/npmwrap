
/*

  npm

*/

"use strict";


/*

  //// Dependencies

*/

var exec = require("./exec");




/*

  //// Exports

*/

var root = module.exports = {};


var flagLookup = {
  "global"  : "--global",
  "save"    : "--save",
  "saveDev" : "--save-dev",
};


function extractFlags(options) {

  var flags = [];

  for (var key in options)
    if (options[key]) flags.push(flagLookup[key])

  return flags;

}


function runCommand(method, command, packages, flags, next) {

  var args = [command],
      options = {};

  // Add arguments
  if ("string" === typeof packages)
    args = args.concat(packages.split(/\s+/));
  else {
    next = flags;
    flags = packages;
  }

  // Allow polymorphism
  if ("function" === typeof flags) {
    next = flags;
    flags = {};
  }

  // Flags
  args = args.concat(flagLookup(flags));

  // Set cwd
  if (flags.cwd) options.cwd = flags.cwd;

  if ("sync" === method)
    return exec.sync("npm", args, options);
  else
    return exec.async("npm", args, options, next);

}


["install", "link", "uninstall", "unlink", "update"].forEach(function(command) {

  root[command] = function(packages, flags, next) {

    if ("function" == typeof flags) {
      next = flags;
      flags = {};
    }

    return runCommand("async", command, packages, flags, next);

  };

  root[command + "Sync"] = function(packages, flags) {
    return runCommand("sync", command, packages, flags);
  };

});

