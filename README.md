# jquery.add-remove
jQuery plugin for dynamically adding and removing "rows" to an element.

**This project is under development and is not at a stable point.**

## Demo ##
https://aaronbirchler.com/jquery.add-remove/test.html

## To Do ##
- [x] Add option to remove template
- [ ] Add option to use template from not within the container
- [ ] Add option to add add & remove buttons
- [x] Add min-rows option
- [x] Add max-rows option
- [ ] Handle nested instances
- [x] Handle renaming of input elements
- [x] Handle ids to avoid duplicates
- [x] Add hooks & callbacks
- [ ] Add ability to confirm removal
- [x] Handle "no rows" situation

## Options ##
* addButton: Selector used to find the add buttons
* autoFocus: Put focus on first input of newly added row
* clearValues: Clears the values from input elements when adding a new row
* container: Selector used to find the container to which rows are added
* modifyId: Function used to modify the ids of elements. Passed the old id and the row number
* modifyName: Function used to modify the names of elements. Passed the old name and row number
* removeButton: Selector used to find the remove buttons
* removeTemplate: Whether to remove the original template or not
* template: Selector used to find the template which rows are cloned from

## Events ##
* add_row:add
* add_row:empty
* add_row:max
* add_row:max_clear
* add_row:min
* add_row:min_clear
* add_row:remove
* add_row:renumber

## Example Usage ##

### HTML ###
```html
<form>
  <div id="container">

    <ul>
      <li>

        <span>
          <label for="test-field-1">Test Field</label>
          <input type="text" id="test-field-1" name="test_field[1]"/>
        </span>

        <button class="remove-button" type="button">Remove</button>

      </li>
    </ul>

    <button type="button" id="add-button" class="add-button">Add</button>

  </div>

</form>
```

### JavScript ###
```javascript
jQuery(function($){
  $("#container").addRemove();
});
```

