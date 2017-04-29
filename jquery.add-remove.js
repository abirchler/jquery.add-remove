(function($){

  /**
   * Custom selector for querying add/remove rows
   */
  $.extend($.expr[":"], {
    add_remove_row: function(el){
      return el.data("add-remove-row") ? true : false;
    }
  });

  $.fn.addRemove = function(options){

    var settings = $.extend({
      addButton:      ".add-button",
      removeButton:   ".remove-button",
      container:      "> *:not(:button):first",
      template:       "> *:not(:button):first > *:last",
      removeTemplate: false,
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

        row.remove();
      });
    }

    return this.each(function(){

      var element   = $(this),
          rowIndex  = 0,
          container = element.find(settings.container),
          template  = element.find(settings.template);

      function addRow(row){

        initializeRow(row);

        modifyName(row, rowIndex);
        modifyId(row, rowIndex);

        rowIndex++;

        row.appendTo(container);
      }

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

        addRow(row);
      });
    });
  }
}(jQuery));
