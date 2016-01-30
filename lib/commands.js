
/*

  npm

*/

"use strict";


/*

  //// Dependencies

*/

var run     = require("./run");




/*

  //// Exports

*/

var root = module.exports = {};




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
  flags = flags || {};
  if (flags.saveDev) args.push("--save-dev");
  if (flags.save) args.push("--save");
  if (flags["global"]) args.push("--global");

  // Set cwd
  if (flags.cwd) options.cwd = flags.cwd;

  if ("sync" === method)
    return run.sync("npm", args, options);
  else
    return run.async("npm", args, options, next);

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

