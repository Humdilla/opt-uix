'use strict';
var Path = require('path');
var fs = require('fs');
var Minimist = require('minimist');
var htmlparser = require('htmlparser2');
var util = require('util');

var SELFCLOSERS = [
  'area',
  'base',
  'br',
  'col',
  'command',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
];

function inlineSVG(path, dest){
  var buff = '';
  var parser = new htmlparser.Parser({
    onprocessinginstruction: function(instruction){
      buff += '<'+instruction+'>';
    },
    onopentag: function(name, attribs){
      if(name == 'img' && attribs.src.endsWith('.svg')){
        buff += fs.readFileSync(attribs.src, 'utf8');
      }
      else {
        buff += '<'+name;
        for(let a in attribs){
          buff += ' '+a+'="'+attribs[a]+'"';
        }
        buff += '>';
      }
    },
    ontext: function(text){
      buff += text;
    },
    onclosetag: function(name){
      if(SELFCLOSERS.indexOf(name) != -1){
        //noop
      }
      else {
        buff += '</'+name+'>';
      }
    },
    oncomment: function(comment){
      buff += '<!--'+comment+'-->';
    },
    onerror: function(error){
      console.log(error);
    },
    onend: function(){
      if
    }
  });
  fs.createReadStream(path, 'utf8').pipe(parser);
}

if(require.main === module){
  var argv = Minimist(process.argv.slice(2));
  if(argv._.length == 0) {  
    var buff = '';
    process.stdin.on('data', function(chunk){
      buff += chunk;
    })
    process.stdin.on('end', function(){
      var files = buff.split(' ');
      files.forEach(function(path){
        inlineSVG(path);
      });
    });
  }
  else {
    argv._.forEach(function(path){
      inlineSVG(path);
    });
  }
}
else
  module.exports = inlineSVG;