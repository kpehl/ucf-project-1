// Recipe Search Scripts

// var searchTerm = "seafood pasta";

// Element Definitions
var recipeContainerEl = $("#recipe-content").addClass("tile is-ancestor");

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
        console.log(callsRemaining + ' calls remaining');
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

    console.log(settings)
    
    // $.ajax(settings).done(function (response) {
    //     console.log(response);
    // });

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

// When the user clicks on the search button, the search term is read and the recipe search is made
var searchInputEl = document.querySelector("#search-input");
var searchFieldEl = document.querySelector("#recipe-search-field");

// Search Handler
var recipeSearchHandler = function(event) {
    event.preventDefault();
    var searchTerm = searchInputEl.value.trim();
    if (searchTerm) {
        complexRecipeSearchCall(searchTerm);
        searchInputEl.value = "";
    } else {
        return
    }
};


// When the user clicks on the recipe tile, they are given recipe information in a modal
$("#recipe-content").on('click', '.recipe-tile', function() {
    console.log("clicked")
    var recipeId = $(this).find("span").text();
    // console.log(recipeId);
    recipeInformationCall(recipeId);
})

// Event listener for a recipe search
searchFieldEl.addEventListener("click", recipeSearchHandler);


// complexRecipeSearchCall();
