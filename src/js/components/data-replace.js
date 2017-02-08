define(['jquery'], function($){
  /* data-replace attribute - Replaces the element with the content of the element with the given ID */
  $('[data-replace]').each(function(){
    var href = $(this).attr('data-replace');
    var prev = $(this).prev();
    var next = $(this).next();
    if(prev.length > 0){
      $(href).children().clone(true).insertAfter(prev);
    }
    else if(next.length > 0){
      $(href).children().clone(true).insertBefore(next);
    }
    else{
      $(href).children().clone(true).appendTo($(this).parent());
    }
    $(this).remove();
  });
});