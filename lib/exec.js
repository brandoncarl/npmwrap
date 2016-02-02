
/*

  run

*/

"use strict";


/*

  //// Dependencies

*/

var child_process = require("child_process"),
    Promise       = require("promise");




/*

  //// Exports

*/

module.exports = {
  sync: runSync,
  async: runAsync
};



/**




function runSync() {

  var args = Array.prototype.slice.call(arguments);

  return child_process.execFileSync.apply(null, args).toString();

}


function runAsync() {

  // Standardize the arguments
  var args = Array.prototype.slice.call(arguments),
      next;

  // If last function isn't callback, run as promise
  if ("function" !== typeof args[args.length-1]) {

    // If function is blank, remove it.
    if ("undefined" === typeof args[args.length-1]) args.pop();

    // Return promise
    return new Promise(function(resolve, reject) {
      args.push(function(err, stdout, stderr) {
        if (err) return reject(err);
        resolve(stdout.toString());
      });
      child_process.execFile.apply(null, args);
    });

  } else {

    // Wrap the output
    next = args.pop();
    args.push(function(err, stdout, stderr) {
      stdout = stdout.toString();
      next(err, stdout);
    });

    return child_process.execFile.apply(null, args);

  }

}


