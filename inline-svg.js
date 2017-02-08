var Path = require('path');
var FileSystem = require('fs');
var Minimist = require('minimist');
var xml2js = require('xml2js');

function inlineSVG(path){
  
}

if(require.main === module){
  var buff = '';
  process.stdin.on('data', function(chunk){
    buff += chunk;
  })
  process.stdin.on('end', function(){
    var files = buff.split(' ');
    var argv = Minimist(process.argv.slice(2));
    console.log(argv);
    files.forEach(function(path){
      console.log(path);
    });
  });
}
else
  module.exports = inlineSVG;