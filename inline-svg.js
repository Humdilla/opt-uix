'use strict';
const Path = require('path');
const fs = require('fs');
const stream = require('stream');
const Minimist = require('minimist');
const htmlparser = require('htmlparser2');
const util = require('util');

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

function inlineSVG(path){
  var source = fs.createReadStream(path, 'utf8');
  var dest = new stream.PassThrough();
  var parser = new htmlparser.Parser({
    onprocessinginstruction: function(instruction){
      dest.write('<'+instruction+'>', 'utf8');
    },
    onopentag: function(name, attribs){
      if(name == 'img' && attribs.src.endsWith('.svg')){
        dest.write(fs.readFileSync(attribs.src, 'utf8'));
      }
      else {
        dest.write('<'+name);
        for(let a in attribs){
          dest.write(' '+a+'="'+attribs[a]+'"', 'utf8');
        }
        dest.write('>', 'utf8');
      }
    },
    ontext: function(text){
      dest.write(text, 'utf8');
    },
    onclosetag: function(name){
      if(SELFCLOSERS.indexOf(name) != -1){
        //noop
      }
      else {
        dest.write('</'+name+'>', 'utf8');
      }
    },
    oncomment: function(comment){
      dest.write('<!--'+comment+'-->', 'utf8');
    },
    onerror: function(error){
      console.log(error);
    },
    onend: function(){
      dest.end();
    },
  });
  source.pipe(parser);
  return dest;
}

if(require.main === module){
  var argv = Minimist(process.argv.slice(2));
  var dest;
  if(!argv.o){
    console.log('Correct usage: node inline-svg [input file] -o [output file]');
    process.exit(1);
  }
  else
    dest = fs.createWriteStream(argv.o);
  if(argv._.length == 0) {
    /* We can assume our input is being piped from stdin */
    var buff = '';
    process.stdin.on('data', function(chunk){
      buff += chunk;
    });
    process.stdin.on('end', function(){
      inlineSVG(buff).pipe(dest);
    });
  }
  else {
    inlineSVG(argv._[0]).pipe(dest);
  }
}
else
  module.exports = inlineSVG;