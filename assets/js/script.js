// Recipe Search Scripts

var searchTerm = "japanese curry";

// Spoonacular API

// complex recipe search: https://spoonacular.com/food-api/docs#Search-Recipes-Complex 
var complexRecipeSearchCall = function() {
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
    
    $.ajax(settings).done(function (response) {
        console.log(response);
        // console.log(response.results[0].title)
        // console.log(response.results[0].image)
        // console.log(response.results[0].id)
    
        displayRecipeResults(response);
    
    });    
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
    var recipeContainerEl = $("#recipe-content")
        .addClass("tile is-ancestor")
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


// When the user clicks on the recipe tile, they are given recipe information in a modal
$(".recipe-tile").click(function() {
    console.log("clicked")
    var recipeId = $(this).find("span").text();
    $('#recipe-modal').addClass('is-active');
    // console.log(recipeId);
    recipeInformationCall(recipeId);

    var modalTitleEl = document.querySelector('#recipe-title');
    var modalTitle = document.createElement('div');
    modalTitle.setAttribute('src',response.results.title);
    modalTitleEl.appendChild(modalTitle);


    var modalIngredientEl = document.querySelector("#recipe-ingredients")
    var modalIngredient = document.createElement('div');
    modalIngredient.setAttribute('src',response.results.);
    modalIngredientEl.appendChild(modalIngredient);

    var modalInstructEl = document.querySelector("#recipe-instructions")
    var modalInstruction = document.createElement('div');
    modalInstruction.setAttribute('src',response.results.);
    modalInstructionEl.appendChild(modalInstruction);

    
})

//save recipe
$('#save-recipe').click(function(){
    console.log("save clicked");
    //add save functionality
})

//add to list
//get ingredients and add to an array probably

//forward/back buttons functionality
//how lmao


//close modal
$('#close-modal-one').click(function() {
    console.log("clicked");
    $('#recipe-modal').removeClass('is-active');
})
$('#close-modal-two').click(function() {
    console.log("clicked");
    $('#recipe-modal').removeClass('is-active');
})

// complexRecipeSearchCall();
