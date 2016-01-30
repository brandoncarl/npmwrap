
/*

  npm

*/

"use strict";


/*

  //// Dependencies

*/

var run     = require("./run"),
    Promise = require("promise");




/*

  //// Exports

*/

var root = module.exports = {};




/*

  //// Package Commands

*/

function packageCommand(method, command, packages, flags, next) {

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
  flags = flags || {};
  if (flags.save) args.push("--save");
  if (flags.saveDev) args.push("--save-dev");
  if (flags["global"]) args.push("--global");

  // Set cwd
  if (flags.cwd) options.cwd = flags.cwd;

  if ("sync" === method)
    return run.sync("npm", args, options);
  else
    return run.async("npm", args, options, next);

}


["install", "uninstall", "update"].forEach(function(command) {

  root[command] = function(packages, flags, next) {

    if ("function" == typeof flags) {
      next = flags;
      flags = {};
    }

    return packageCommand("async", command, packages, flags, next);

  };

  root[command + "Sync"] = function(packages, flags) {
    return packageCommand("sync", command, packages, flags);
  };

});




/*

  //// Basic commands

*/


function basicCommand(method, command, flags, next) {

  var flags = flags || {},
      options = {};

  // Set cwd
  if (flags.cwd) options.cwd = flags.cwd;

  if ("sync" === method)
    return run.sync("npm", [command], options);
  else
    return run.async("npm", [command], options, next);

}


["link", "unlink"].forEach(function(command) {

  root[command] = function(flags, next) {

    if ("function" == typeof flags) {
      next = flags;
      flags = {};
    }

    return basicCommand("async", command, next);

  };

  root[command + "Sync"] = function(flags) {
    return basicCommand("sync", command, flags || {});
  }

});


