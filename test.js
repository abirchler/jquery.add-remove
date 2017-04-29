jQuery(function($){

  function flashClass(element, className, duration){

    if ( ! duration ) duration = 500;

    var t = $(element);

    t.addClass(className);

    setTimeout(function(){
      t.removeClass(className);
    }, duration);
  }

  $("#row-sel-test").click(function(){

    $(":add_remove_row").addClass("highlight");
    setTimeout(function(){
      $(":add_remove_row").removeClass("highlight");
    }, 3000);
  });

  $(document).on("add_remove:add", function(evt){
    flashClass(evt.target, "added")
  })
  .on("add_remove:remove", function(evt, data){

    flashClass(evt.target, "removed");
  })
  .on("add_remove:renumber", function(evt){
    flashClass(evt.target, "renumber");
  })
  ;

  $("#container").addRemove({
    placeholder: '<li>Your list is empty<br/><button type="button" style="font-size:larger;" class="add-button">Add an item</button></li>'
  });

  $("#table-form").addRemove({
    container: "tbody",
    template: "tbody tr:last",
    autoFocus: true,
    minRows: 2,
    maxRows: 7
  });

  $("#l2").addRemove();;

  $(document).on("add_remove:max", function(evt){
    flashClass(evt.target, "maxed", 2000);
  });
  $(document).on("add_remove:min", function(evt){
    flashClass(evt.target, "maxed", 2000);
  });
  $(document).on("add_remove:max_clear", function(evt){
    flashClass(evt.target, "avail", 1000);
  });
  $(document).on("add_remove:min_clear", function(evt){
    flashClass(evt.target, "avail", 1000);
  });

});

