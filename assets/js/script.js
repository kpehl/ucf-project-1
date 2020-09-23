// Recipe Search Scripts

// var searchTerm = "seafood pasta";

// Element Definitions
var recipeContainerEl = $("#recipe-content").addClass("tile is-ancestor");
var shoppingListEl = $("#shopping-list-container");

// Google Places API
// Define personal API Key
var myKey = "AIzaSyAA5eb9-1T_lunhaqi0inxQjTbBFHdKCrU"
// Define the embedded map url with a supermarket query and a zoom setting to show the local area 
var embeddedMapUrl = "https://www.google.com/maps/embed/v1/search?key=" + myKey + "&q=supermarket&zoom=12";
// Create the html element
embeddedMapEl = '<figure class = "image"><iframe width="450" height="250" frameborder="0" style="border:0" src="' + embeddedMapUrl + '" allowfullscreen></iframe></figure>'
// Embed the map with the search results
document.querySelector("#map-container").innerHTML = embeddedMapEl;

// Spoonacular API

// complex recipe search: https://spoonacular.com/food-api/docs#Search-Recipes-Complex 
var complexRecipeSearchCall = function(searchTerm) {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?query=" + searchTerm + "&instructionsRequired=false&number=12",
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
            "x-rapidapi-key": "01310f4453msh5296c1bfdec8643p1f8127jsna75a6fa4a050"
        }
    }
    
    $.ajax(settings)
    .done(function (response, status, jqXHR) {
        var callsRemaining = jqXHR.getResponseHeader("x-ratelimit-requests-remaining");

        // A check to prevent overage charges on the API
        if (callsRemaining > 5) {
            displayRecipeResults(response);
        } else if (callsRemaining > 2) {
            $("#error-modal").addClass("is-active")
            $("#modal-error-content").text('Only ' + callsRemaining + ' searches left today');
            displayRecipeResults(response);
        } else {
            $("#error-modal").addClass("is-active")
            $("#modal-error-content").text('Out of searches today. So sorry!');
            return
        }   
    })
    .fail(function() {
        $("#error-modal").addClass("is-active")
        $("#modal-error-content").text('There was an error communicating with the server. Please try again.');
    })    
}

// recipe information search: https://spoonacular.com/food-api/docs#Get-Recipe-Information
var recipeInformationCall = function(recipeId,tileId,totalTiles) {

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
    
    // data request
    $.ajax(settings).done(function (response, status) {

        // extract the title
        var recipeTitle = response.title;

        // extract the ingredient list and the shopping list items
        var ingredientsList = {};
        var shoppingList = {};
        for (i = 0; i < (response.extendedIngredients).length; i++) {
            ingredientsList[i] = response.extendedIngredients[i].originalString;
            shoppingList[i] = response.extendedIngredients[i].name;
        }

        // extract the source url
        var sourceUrl = response.sourceUrl;

        // extract the recipe picture URL
        var pictureUrl = response.image

        // extract the recipe summary
        var summary = response.summary;

        // extract the recipe instructions
        var instructions = response.instructions;

        // An HTML Element is created for the title
        var titleEl = '<p class="is-size-5 has-text-weight-bold" id="modal-title">' + recipeTitle + '</p>';

        // An HTML Element is created for the Recipe ID
        var recipeIdEl = '<p class="is-size-7 is-hidden" id="modal-recipe-id">' + recipeId + '</p>';

        // An HTML Element is created for the Tile ID
        var tileIdEl = '<p class="is-size-7 is-hidden" id="modal-tile-id">' + tileId + '</p>';

        // An HTML Element is created for the total number of tiles
        var totalTilesEl = '<p class="is-size-7 is-hidden" id="modal-total-tile">' + totalTiles  + '</p>';

        // An HTML Element is created for the source URL
        var urlEl = '<p class="is-size-7"><a href="' + sourceUrl + '" target="_blank">See original recipe</a></p>';

        // An HTML Element is created for the image
        var pictureEl = '<figure class = "image is-128x128" id="modal-picture"><img src="' + pictureUrl + '" alt="recipe picture" /></figure>'

        // An HTML Element is created for the summary
        var summaryEl = '<p class="is-size-7">'+ summary + '</p>';

        // An HTML element is created for the ingredient list
        var ingredientsListArr = Object.values(ingredientsList);
        var ingredientsListString = ingredientsListArr.join('<br>');
        var ingredientsListEl = '<p>' + ingredientsListString + '</p>';

        // An HTML element is created for the shopping list items
        var shoppingListEl = '<p class = "is-hidden" id = "shopping-list-items">' + JSON.stringify(shoppingList) + '</p>';

        // An HTML Element is created for the instructions
        var instructionsEl = '<p>' + instructions + '</p>';

        // The information is copied to the DOM in the recipe modal
        $('#modal-recipe-title').html(titleEl + tileIdEl + totalTilesEl + recipeIdEl)
        $('#modal-recipe-ingredients').html(pictureEl + ingredientsListEl + shoppingListEl)
        $('#modal-recipe-instructions').html(instructionsEl)
    })
    .fail(function() {
        $("#error-modal").addClass("is-active")
        $("#modal-error-content").text('There was an error communicating with the server. Please try again.');
    })     
}


// A function to display the recipe results from a search
var displayRecipeResults = function(response) {
    // clear previous content
    document.querySelector("#recipe-content").innerHTML = "";
    // add a title
    document.querySelector("#recipe-search-header").innerHTML = "<h3>Search Results:<h3>";
    // loop through the results and create tiles for each
    for (i=0;i<Object.keys(response.results).length;i++) {
        var recipeEl = $("<div>")
            .addClass('tile is-parent is-2 recipe-tile');
        var recipeTileEl = $("<article>")
            .addClass('tile is-child is-info');
        var recipeTileTitleEl = $("<p>")
            .addClass('subtitle')
            .text(response.results[i].title)
        var recipeIdEl = $("<span hidden>")
            .attr("id", "recipe-id")
            .text(response.results[i].id);
        var tileIdEl = $("<span hidden>")
        .attr("id", "tile-id")
        .text(i);
        var totalTilesEl = $("<span hidden>")
        .attr("id", "total-tiles")
        .text(Object.keys(response.results).length)
        var recipeTileFigureEl = $("<figure>")
            .addClass('image is-96x96');
        var recipeTileImgEl = $("<img />")
            .attr("src", response.results[i].image);

        recipeTileImgEl.appendTo($(recipeTileFigureEl));
        recipeTileTitleEl.appendTo($(recipeTileEl));
        recipeIdEl.appendTo($(recipeTileEl));
        tileIdEl.appendTo($(recipeTileEl));
        totalTilesEl.appendTo($(recipeTileEl));
        recipeTileFigureEl.appendTo($(recipeTileEl));
        recipeTileEl.appendTo($(recipeEl));
        recipeEl.appendTo($(recipeContainerEl));
    }
}

// initialize the saved shopping items array
var savedShoppingListArr = [];

// A function to load shopping list items from local storage
var loadShoppingListItems = function() {
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
    localStorage.setItem("shopping-list-items",JSON.stringify(savedShoppingListArr))
}

// A function to display the saved shopping list
var displaySavedShoppingList = function() {
    loadShoppingListItems();
    // clear out any previous content
    document.querySelector("#shopping-list-container").innerHTML = "";

    // display the updated list
    for (i=0; i < Object.keys(savedShoppingListArr).length; i++) {

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

    // load the saved items
    loadShoppingListItems(savedShoppingListArr);

    // add the new items, checking for repeated items
    for (i=0; i < Object.keys(shoppingList).length; i++) {
        var duplicate = savedShoppingListArr.includes(shoppingList[i]);
        if (!duplicate) {
            savedShoppingListArr.push(shoppingList[i]);
        } else {
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
    // Get the information from the recipe tile
    var recipeId = $(this).find("#recipe-id").text();
    var tileId = $(this).find("#tile-id").text();
    var totalTiles = $(this).find("#total-tiles").text();
    // Call the recipe API
    recipeInformationCall(recipeId, tileId, totalTiles);
    // Show the recipe modal
    var target = $("#recipe-modal");
    $("html").addClass("is-clipped");
    $(target).addClass("is-active");
    // The remove recipe button is hidden (only shown when a recipe is loaded from the saved recipe list)
    $("#modal-remove-recipe").addClass("is-hidden")
    // the previous button is disabled for the first result and the next button is disabled for the last search result
    $("#modal-back-button, #modal-next-button").removeAttr("disabled");
    if (tileId == 0) {
        $("#modal-back-button").attr("disabled", true);
    } else if (tileId == (totalTiles - 1)) {
        $("#modal-next-button").attr("disabled", true);
    }
});

// When the user clicks on a saved recipe, they are given the information again
$("#saved-recipe-list").on('click', 'li', function() {
    // The recipe id is obtained from the element
    var recipeId = $(this).find("span").text();
    recipeInformationCall(recipeId);
    // The recipe modal is shown
    var target = $("#recipe-modal")
    $("html").addClass("is-clipped");
    $(target).addClass("is-active");
    // The save, next, and previous buttons are hidden
    $("#modal-save-recipe").addClass("is-hidden")
    $("#modal-next-button").addClass("is-hidden")
    $("#modal-back-button").addClass("is-hidden")
});

// When a modal is closed, the user is returned to the active page and the buttons are returned to the neutral state
$(".modal-close, #close-modal-one, #close-modal-two, #close-modal-error-one, #close-modal-error-two").click(function() {
    $("html").removeClass("is-clipped");
    $(this).parents().removeClass("is-active");
    $("#modal-save-recipe").removeClass("is-hidden")
    $("#modal-remove-recipe").removeClass("is-hidden")
    $("#modal-next-button").removeClass("is-hidden")
    $("#modal-back-button").removeClass("is-hidden")
});

// When the user clicks on the Save Recipe button in the modal, a mini recipe tile is moved to the saved recipe list, and the recipe list is refreshed
$("#save-recipe-button, #modal-save-recipe").on('click', function() {
    createSavedRecipe();
    saveRecipe();
    loadRecipe();
});

// When the user clicks on the Add Ingredients to Shopping List button, the ingredients are added
$("#save-ingredients-button,#save-ingredients-button-2, #modal-add-ingredients").on('click', function() {
    var shoppingListString = $("#shopping-list-items")[0].innerHTML;
    var shoppingList = JSON.parse(shoppingListString);
    moveToShoppingList(shoppingList);
})

// When the user clicks on the Remove Recipe button, the recipe is removed from the Saved Recipe List, and the modal is closed in neutral state
$("#remove-recipe-button, #modal-remove-recipe").on('click', function() {
    var selectedRecipeId = $("#modal-recipe-id")[0].innerHTML;
    localSavedRecipes.forEach(function(items, index) {
        var recipeId = items.id;
        if (recipeId == selectedRecipeId) {
            localSavedRecipes.splice(index,1);
        }
    })
    saveRecipe();
    loadRecipe();
    $("html").removeClass("is-clipped");
    $(this).parents().removeClass("is-active");
    $("#modal-save-recipe").removeClass("is-hidden")
    $("#modal-remove-recipe").removeClass("is-hidden")
    $("#modal-next-button").removeClass("is-hidden")
    $("#modal-back-button").removeClass("is-hidden")
});

// When the user clicks on the "next" button, the next recipe result is shown in the modal
$("#modal-next-button").on('click', function() {
    var tileId = $('#modal-tile-id')[0].innerHTML;
    var totalTiles = $('#modal-total-tile')[0].innerHTML;
    var nextTileId = parseInt(tileId) + 1;
    var nextRecipeTile = $(".recipe-tile")[nextTileId];
    var nextRecipeId = $("span#recipe-id")[nextTileId].innerHTML;

    recipeInformationCall(nextRecipeId, nextTileId, totalTiles);

    var target = $("#recipe-modal");
    $("html").addClass("is-clipped");
    $(target).addClass("is-active");
    $("#modal-remove-recipe").addClass("is-hidden")

    // the previous button is disabled for the first result and the next button is disabled for the last search result
    $("#modal-back-button, #modal-next-button").removeAttr("disabled");
    if (nextTileId == 0) {
        $("#modal-back-button").attr("disabled", true);
    } else if (nextTileId == (totalTiles - 1)) {
        $("#modal-next-button").attr("disabled", true);
    }

})

// When the user clicks on the "previous" button, the previous recipe result is shown in the modal
$("#modal-back-button").on('click', function() {
    var tileId = $("#modal-tile-id")[0].innerHTML;
    var totalTiles = $('#modal-total-tile')[0].innerHTML;
    var prevTileId = parseInt(tileId) - 1;
    var prevRecipeTile = $(".recipe-tile")[prevTileId];
    var prevRecipeId = $("span#recipe-id")[prevTileId].innerHTML;

    recipeInformationCall(prevRecipeId, prevTileId, totalTiles);

    var target = $("#recipe-modal");
    $("html").addClass("is-clipped");
    $(target).addClass("is-active");
    $("#modal-remove-recipe").addClass("is-hidden")
    // the previous button is disabled for the first result and the next button is disabled for the last search result
    $("#modal-back-button, #modal-next-button").removeAttr("disabled");
    if (prevTileId == 0) {
        $("#modal-back-button").attr("disabled", true);
    } else if (prevTileId == (totalTiles - 1)) {
        $("#modal-next-button").attr("disabled", true);
    }

})

// initialize the saved recipes array
var localSavedRecipes = [];

// Create a Saved Recipe Element
var createSavedRecipe = function() {
    // get the recipe title, recipe id, tile id and picture tag from the modal
    var title = $("#modal-title").text();
    var pictureTag = $("#modal-picture")[0].innerHTML;
    var recipeId = $("#modal-recipe-id")[0].innerHTML;
    // An HTML Element is created for the title and id
    var titleEl = '<p class="is-size-7"><span class = "is-hidden">' + recipeId + '</span>' + title + '</p>'
    // An HTML Element is created for the image
    var pictureEl = '<figure class = "image">' + pictureTag + '</figure>'
    // A list item element is created for the saved recipe
    savedRecipeListItem = $("<li class = 'saved-recipe-item'>")
    // The content is added to the list item is added to the Saved Recipes list
    savedRecipeListItem.html(pictureEl + titleEl);
    savedRecipeListItem.appendTo($("#saved-recipe-list"));
    // If the item is a duplicate, the duplicate is removed
    localSavedRecipes.forEach(function(items, index) {
        var savedRecipeId = items.id;
        if (recipeId == savedRecipeId) {
            localSavedRecipes.splice(index,1)
        }
    })
    // The recipe attributes are saved to the saved recipe array at the beginning
    var localRecipeItem = {"title": titleEl, "picture": pictureEl, "id": recipeId};
    localSavedRecipes.unshift(localRecipeItem);

};

// Save the saved recipe list
var saveRecipe = function() {
    localStorage.setItem("saved-recipes", JSON.stringify(localSavedRecipes));
};

// Load Recipe Function
var loadRecipe = function() {
    localSavedRecipes = JSON.parse(localStorage.getItem("saved-recipes"));

    // if there is nothing in local storage, create a new empty to track the recipe information objects
    if (!localSavedRecipes) {
        localSavedRecipes = [];
    }

    // Clear out old content
    $("#saved-recipe-list").empty();

    // loop over the object properties and create the saved elements
    localSavedRecipes.forEach(function(items) {
        var titleEl = items.title;
        var pictureEl = items.picture;
        var recipeId = items.id;
        // A list item element is created for the saved recipe
        savedRecipeListItem = $("<li>")
        // The content is added to the list item is added to the Saved Recipes list
        savedRecipeListItem.html(pictureEl + titleEl);
        savedRecipeListItem.appendTo($("#saved-recipe-list"));
    })
};

// When the user clicks on a shopping list item, they are given the option to edit or delete it entirely
$("#shopping-list-container").on('click', '.shopping-list-item', function() {
    var shoppingItemIndex = $(this).parent().data("index");
    var text = $(this).text().trim();
    var textInput = $("<textarea>").addClass("form-control").val(text);
    $(this).replaceWith(textInput);
    textInput.trigger("focus")
})
// blur event to replace the textarea with the new p element 
$("#shopping-list-container").on("blur", "textarea", function() {
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

// When the user clicks on the Shopping List add item button, the item is read and added to the list
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

// Remove All Shopping List Items
$("#remove-all-items").on("click", function() {
        savedShoppingListArr.length = 0;
        saveShoppingListItems();
        $("#shopping-list-container").empty()
})


// Event listener for a recipe search
searchFieldEl.addEventListener("click", recipeSearchHandler);

// Event listener for adding a shopping list item
addItemFieldEl.addEventListener("click", addItemHandler);

// Display the saved shopping list when the page loads
displaySavedShoppingList();

// Load saved recipes when the page loads
loadRecipe();
