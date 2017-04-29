(function($){

  /**
   * Custom selector for querying add/remove rows
   */
  $.extend($.expr[":"], {
    add_remove_row: function(el){
      return $(el).data("add-remove-row") ? true : false;
    },
    add_remove_container: function(el){
      return $(el).data("add-remove-container") ? true : false;
    }
  });

  $.fn.addRemove = function(options){

    var settings = $.extend({
      addButton:      ".add-button",
      removeButton:   ".remove-button",
      container:      "> *:not(:button):first",
      template:       "> *:not(:button):first > *:last",
      removeTemplate: false,
      placehoolder:   null,
      maxRows:        null,
      minRows:        0,
      modifyId:       function(oldId, rowNumber){

        if ( oldId ) {

          var newId = oldId.replace(/(-|_)\d+$/, "$1" + rowNumber)
        }
        else {

          newId = null;
        }

        return newId;
      },
      modifyName:     function(name, rowNumber){

        if ( name ) {

          var newName = name.replace(/\[[^\]]\]$/, "[" + rowNumber + "]");
        }
        else {
          newName = null;
        }

        return newName;
      }
    }, options);

    /**
     * Modifies the name of a row so it matches the row index
     */
    function modifyName(row, rowNumber) {

      row.find(":input").each(function(){

        var input   = $(this),
            oldName = input.attr("name");

        var newName = settings.modifyName(oldName, rowNumber);

        input.attr("name", newName);
      });
    }

    function modifyId(row, rowNumber) {

      row.find("[id]").each(function(){

        var element  = $(this),
            oldId     = element.attr("id");

        var newId = settings.modifyId(oldId, rowNumber);

        element.attr("id", newId);
      });

      row.find("label[for]").each(function(){

        var element  = $(this),
            oldId     = element.attr("for");

        var newId = settings.modifyId(oldId, rowNumber);

        element.attr("for", newId);
      });
    }

    function initializeRow(row){

      row.data("add-remove-row", true);

      var removeButton = row.find(settings.removeButton);

      removeButton.click(function(){

        var sibs = row.siblings(":add_remove_row");

        var p = row.parent();

        row.remove();

        p.trigger("add_remove:remove", {element:row[0]});

        sibs.each(function(rowIndex){

          var row = $(this);

          modifyName(row, rowIndex);
          modifyId(row, rowIndex);

          row.trigger("add_remove:renumber");
        });
      });
    }

    return this.each(function(){

      var element   = $(this),
          container = element.find(settings.container),
          template  = element.find(settings.template),
          placeholder = settings.placeholder ? $(settings.placeholder) : null;

      container.on("add_remove:remove", function(evt){
        if ( settings.placeholder && ! container.children(":add_remove_row").length ){
          container.append(placeholder);
        }
      });

      container.data("add-remove-container", true);

      function addRow(row){

        initializeRow(row);

        row.appendTo(container);

        row.trigger("add_remove:add");

        container.find(":add_remove_row").each(function(rowIndex){

          var row = $(this);

          modifyName(row, rowIndex);
          modifyId(row, rowIndex);

          row.trigger("add_remove:renumber");
        });
      }

      if ( settings.removeTemplate ){

        template.remove();
      }

      container.find("> *").each(function(){

        var row = $(this);

        initializeRow(row);
      });

      template = template.clone();

      element.on("click", settings.addButton, function(){

        var row = template.clone();

        if ( placeholder ) placeholder.remove();

        addRow(row);
      });
    });
  }
}(jQuery));
