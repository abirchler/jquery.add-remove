(function($){

  $.fn.addRemove = function(options){

    var settings = $.extend({
      addButton: ".add-button",
      removeButton: ".remove-button",
      container: "> *:first",
      template: "> *:first > *:first",
      removeTemplate: false
    }, options);

    function initializeRow(row){
      var removeButton = row.find(settings.removeButton);
      removeButton.click(function(){
        row.remove();
      });
    }

    return this.each(function(){

      var element = $(this);
      var container = element.find(settings.container);
      var template = element.find(settings.template);

      if ( settings.removeTemplate ){
        template.remove();
      }

      container.find("> *").each(function(){
        var row = $(this);
        initializeRow(row);
      });

      template = template.clone();

      element.find(settings.addButton).on("click", function(){
        var row = template.clone();
        initializeRow(row);
        row.appendTo(container);
      });
    });
  }
}(jQuery));
