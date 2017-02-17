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

/**
 * Switch cwd to the given path, call the given function, and return to the
 * path you were at previously.
 * @param {String} path  Path to change to.
 * @param {Function} cb  Function to call after changing directories. Takes
 * no arguments.
 */
function doIn(path, cb){
  var oldPath = process.cwd();
  process.chdir(path);
  cb();
  process.chdir(oldPath);
};

/**
 * Inlines the SVG sources of given HTML file.
 * @param {String} path  Path to source HTML file.
 * @return {Stream}      ReadStream with the output html file as the source.
 */
function inlineSVG(path){
  var source = fs.createReadStream(path, 'utf8');
  var dest = new stream.PassThrough();
  var parser = new htmlparser.Parser({
    onprocessinginstruction: function(instruction){
      dest.write('<'+instruction+'>', 'utf8');
    },
    onopentag: function(name, attribs){
      /* Write external svg contents to output */
      if(name == 'img' && attribs.src.endsWith('.svg')){
        doIn(Path.dirname(path), function(){
          dest.write(fs.readFileSync(attribs.src, 'utf8'));
        });
      }
      /* Write external css contents to output */
      else if(name == 'link' && attribs.href.endsWith('.css')){
        doIn(Path.dirname(path), function(){
          dest.write('<style>'+fs.readFileSync(attribs.href, 'utf8')
          /* Resolve relative paths found in css */
          .replace(/url\((["']?(.*?)["']?)\)/gi, function(match, p1, p2){
            doIn(Path.dirname(attribs.href), function(){
              console.log(p2);
              console.log(Path.dirname(path));
              console.log(Path.relative(Path.dirname(path), p2));
            });
            return match;
          })
          +'</style>');
        });
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
};

if(require.main === module){
  var argv = Minimist(process.argv.slice(2));
  var dest;
  if(!argv.o){
    dest = process.stdout;
  }
  else
    dest = fs.createWriteStream(argv.o);
  if(argv._.length == 0) {
    /* If minimist finds no args we can assume our input is being piped from stdin */
    var buff = '';
    process.stdin.on('data', function(chunk){
      buff += chunk;
    });
    process.stdin.on('end', function(){
      if(!buff){
        console.log('Please specify an input file like so: node inline-svg.js [input_file]');
        process.exit(1);
      }
      inlineSVG(buff).pipe(dest);
    });
  }
  else {
    inlineSVG(argv._[0]).pipe(dest);
  }
}
else
  module.exports = inlineSVG;