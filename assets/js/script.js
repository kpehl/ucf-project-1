// Recipe Search Scripts

// var searchTerm = "seafood pasta";

// Element Definitions
var recipeContainerEl = $("#recipe-content").addClass("tile is-ancestor");
var shoppingListEl = $("#shopping-list-container");

// Spoonacular API

// complex recipe search: https://spoonacular.com/food-api/docs#Search-Recipes-Complex 
var complexRecipeSearchCall = function(searchTerm) {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?query=" + searchTerm,
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
            "x-rapidapi-key": "01310f4453msh5296c1bfdec8643p1f8127jsna75a6fa4a050"
        }
    }
    
    $.ajax(settings)
    .done(function (response, status, jqXHR) {
        // console.log(response);
        console.log(status);
        // var responseHeaders = jqXHR.getAllResponseHeaders();
        var callsRemaining = jqXHR.getResponseHeader("x-ratelimit-requests-remaining");
        // console.log(responseHeaders);
        console.log(callsRemaining + ' search calls remaining');
        // console.log(response.results[0].title)
        // console.log(response.results[0].image)
        // console.log(response.results[0].id)

        // A check to prevent overage charges on the API
        if (callsRemaining > 5) {
            displayRecipeResults(response);
        } else if (callsRemaining > 2) {
            alert('Only' + callsRemaining + 'free searches left today');
            displayRecipeResults(response);
        } else {
            alert('Out of searches today. So sorry!')
            return
        }   
    })
    .fail(function() {
        alert('There was an error communicating with the server. Please try again.');
    })    
}

// recipe information search: https://spoonacular.com/food-api/docs#Get-Recipe-Information
var recipeInformationCall = function(recipeId) {
    console.log("recipeInformationCall function was called");
    console.log(recipeId)

    // settings for the API call
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/" + recipeId + "/information",
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
            "x-rapidapi-key": "01310f4453msh5296c1bfdec8643p1f8127jsna75a6fa4a050"
        }
    }

    // console.log(settings)
    
    // data request
    $.ajax(settings).done(function (response, status) {
        console.log('recipe details ' + status);
        console.log(response);

        console.log(response.extendedIngredients)

        // extract the ingredient list and the shopping list items
        var ingredientsList = {};
        var shoppingList = {};
        for (i = 0; i < (response.extendedIngredients).length; i++) {
            ingredientsList[i] = response.extendedIngredients[i].originalString;
            shoppingList[i] = response.extendedIngredients[i].name;
        }
        console.log(ingredientsList);
        console.log(shoppingList);

        // extract the source url
        var sourceUrl = response.sourceUrl;
        console.log(sourceUrl);

        // extract the recipe summary
        var summary = response.summary;
        console.log(summary);

        // extract the recipe instructions
        var instructions = response.instructions;
        console.log(instructions);

        moveToShoppingList(shoppingList);

    });
}


// A function to display the recipe results from a search
var displayRecipeResults = function(response) {
    // clear previous content
    document.querySelector("#recipe-content").innerHTML = "";
    // console.log(recipeContainerEl)
    for (i=0;i<Object.keys(response.results).length;i++) {
        var recipeEl = $("<div>")
            .addClass('tile is-parent is-2 recipe-tile');
        // console.log(recipeEl)
        var recipeTileEl = $("<article>")
            .addClass('tile is-child is-info');
        // console.log(recipeTileEl)
        var recipeTileTitleEl = $("<p>")
            .addClass('subtitle')
            .text(response.results[i].title)
        // console.log(recipeTileTitleEl)
        var recipeIdEl = $("<span hidden>")
            .attr("id", "recipe-id")
            .text(response.results[i].id);
        // console.log(recipeIdEl);
        var recipeTileFigureEl = $("<figure>")
            .addClass('image is-96x96');
        // console.log(recipeTileFigureEl)
        var recipeTileImgEl = $("<img />")
            .attr("src", response.results[i].image);
        // console.log(recipeTileImgEl)

        recipeTileImgEl.appendTo($(recipeTileFigureEl));
        recipeTileTitleEl.appendTo($(recipeTileEl));
        recipeIdEl.appendTo($(recipeTileEl));
        recipeTileFigureEl.appendTo($(recipeTileEl));
        recipeTileEl.appendTo($(recipeEl));
        recipeEl.appendTo($(recipeContainerEl));
    }
}

// initialize the saved shopping items array
var savedShoppingListArr = [];

// A function to load shopping list items from local storage
var loadShoppingListItems = function() {
    console.log('load shopping list items was called')
    // load any items from local storage
    savedShoppingListArr = JSON.parse(localStorage.getItem("shopping-list-items"));
    // if there is nothing stored, set the variable as an empty array
    if (!savedShoppingListArr) {
        savedShoppingListArr = [];
    }
    return savedShoppingListArr;
}

// A function to save shopping list items to local storage
var saveShoppingListItems = function() {
    console.log('save shopping list was called')
    localStorage.setItem("shopping-list-items",JSON.stringify(savedShoppingListArr))
}

// A function to display the saved shopping list
var displaySavedShoppingList = function() {
    loadShoppingListItems();
    // clear out any previous content
    document.querySelector("#shopping-list-container").innerHTML = "";

    // display the updated list
    for (i=0; i < Object.keys(savedShoppingListArr).length; i++) {
        console.log(savedShoppingListArr[i])

        var shoppingListItemPEl = $("<p>")
            .addClass('shopping-list-item')
            .text(savedShoppingListArr[i])
            // .attr('data-index', i);
        var shoppingListItemButtonEl = $("<button>")
            .attr('data-index', i);
            // .text(savedShoppingListArr[i]);
        shoppingListItemPEl.appendTo($(shoppingListItemButtonEl));
        shoppingListItemButtonEl.appendTo($(shoppingListEl));
    }
}

// A function to move shopping list items to the saved list and display the new list
var moveToShoppingList = function(shoppingList) {
    console.log('move to shopping list was called')
    // console.log(shoppingList);
    // console.log(shoppingList[0]);

    // load the saved items
    loadShoppingListItems(savedShoppingListArr);

    // add the new items, checking for repeated items
    for (i=0; i < Object.keys(shoppingList).length; i++) {
        console.log(shoppingList[i])
        var duplicate = savedShoppingListArr.includes(shoppingList[i]);
        if (!duplicate) {
            console.log('not a duplicate')
            savedShoppingListArr.push(shoppingList[i]);
        } else {
            console.log('duplicate')
            continue
        }
    }

    // save the updated array
    saveShoppingListItems();

    // Display the updated array
    displaySavedShoppingList();
};

// When the user clicks on the search button, the search term is read and the recipe search is made
// Needed DOM elements are defined
var searchInputEl = document.querySelector("#search-input");
var searchFieldEl = document.querySelector("#recipe-search-field");

// Search Handler Function
var recipeSearchHandler = function(event) {
    // get the search term and trim off any leading or following white space
    var searchTerm = searchInputEl.value.trim();
    // if a search term was entered, execute the search and clear the search box, otherwise, do nothing
    if (searchTerm) {
        complexRecipeSearchCall(searchTerm);
        searchInputEl.value = "";
    } else {
        return
    }
    // prevent the default refreshing of the page and submitting the form to a server
    event.preventDefault();
};


// When the user clicks on the recipe tile, they are given recipe information in a modal
$("#recipe-content").on('click', '.recipe-tile', function() {
    console.log("clicked")
    var recipeId = $(this).find("span").text();
    // console.log(recipeId);
    recipeInformationCall(recipeId);
})

// When the user clicks on a shopping list item, they are given the option to edit or delete it entirely
$("#shopping-list-container").on('click', '.shopping-list-item', function() {
    console.log('shopping list item clicked')
    var shoppingItemIndex = $(this).parent().data("index");
    console.log('index: ' + shoppingItemIndex)
    var text = $(this).text().trim();
    var textInput = $("<textarea>").addClass("form-control").val(text);
    $(this).replaceWith(textInput);
    textInput.trigger("focus")
})
// blur event to replace the textarea with the new p element 
$("#shopping-list-container").on("blur", "textarea", function() {
    console.log("blur")
    // get the new text value
    var text = $(this).val().trim();
    // get the index number of the changed item
    var shoppingItemIndex = $(this).parent().data("index");
    // if the value was deleted, remove the element from the array
    if (text == "") {
        savedShoppingListArr.splice(shoppingItemIndex,1)
    } else {
    // set the array value to the new value
    savedShoppingListArr[shoppingItemIndex] = text;
    }
    // save the array
    saveShoppingListItems();
    // display the shopping list again with edits in place
    displaySavedShoppingList();
})

// When the user clicks on the add item button, the item is read and added to the list
// Needed DOM elements are defined
var addItemInputEl = document.querySelector("#item-input");
var addItemFieldEl = document.querySelector("#add-item-field");

// Add Shopping List Item Handler
var addItemHandler = function() {
    // get the entered value
    var text = $("#item-input").val();
    // if something was submitted, add it to the array, save the array, 
    //and display the updated list, otherwise, do nothing
    if (text) {
        savedShoppingListArr.unshift(text)
        saveShoppingListItems();
        displaySavedShoppingList();
    } else {
        return
    }
}


// Event listener for a recipe search
searchFieldEl.addEventListener("click", recipeSearchHandler);

// Event listener for adding a shopping list item
addItemFieldEl.addEventListener("click", addItemHandler);

// Display the saved shopping list when the page loads
displaySavedShoppingList();
