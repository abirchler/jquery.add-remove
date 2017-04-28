(function($){

  $.fn.addRemove = function(options){

    var settings = $.extend({
      addButton: ".add-button",
      removeButton: ".remove-button",
      container: "> *:first",
      template: "> *:first > *:first"
    }, options);

    return this.each(function(){

      var element = $(this);
      var container = element.find(settings.container);
      var template = element.find(settings.template);

      template = template.clone();

      console.log(container);
      console.log(template);

      element.find(settings.addButton).on("click", function(){
        var row = template.clone();
        var removeButton = row.find(settings.removeButton);
        console.log("Remove button:");
        console.log(removeButton);
        removeButton.click(function(){
          row.remove();
        });
        row.appendTo(container);
      });
    });
  }
}(jQuery));
