require.config({
  paths: {
    jquery: 'lib/jquery-3.1.1',
    backbone: 'lib/backbone',
    underscore: 'lib/underscore',
  },
  shim: {
  }
});

/* Load polyfills */
/*
require(
  [
    'polys/pointer-events',
    'polys/json2',
    'polys/starts-with'],
  function(){
    console.log('Polyfills loaded.');
  }
);*/

/* Load custom component functionality */
/*
require(
  [
    'components/autoselect',
    'components/data-replace'],
  function(){
    console.log('Components loaded.');
  }
);*/
