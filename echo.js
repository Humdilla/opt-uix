var Path = require('path');
var Minimist = require('minimist');

var argv = Minimist(process.argv.slice(2));
var l = argv._.length;
for(var i = 0; i < l; i++){
  if(i < l - 1)
    process.stdout.write(argv._[i]+' ');
  else
    process.stdout.write(argv._[i]);
}