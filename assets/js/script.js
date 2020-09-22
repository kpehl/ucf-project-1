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

    //console.log(settings)
    
     $.ajax(settings).done(function (response) {
         console.log(response);

        /* 
        var modalTitleEl = document.querySelector('#recipe-title');
         var modalTitle = document.createElement('div');
         modalTitle.value(response.title);
         modalTitleEl.appendChild(modalTitle);
     
         var modalIngredientEl = document.querySelector("#recipe-ingredients")
         var modalIngredient = document.createElement('div');
         modalIngredient.text(response.extendedIngredients);
         modalIngredientEl.appendChild(modalIngredient);
     
         var modalInstructEl = document.querySelector("#recipe-instructions")
         var modalInstruction = document.createElement('div');
         modalInstruction.text(response.instructions);
         modalInstructEl.appendChild(modalInstruction);
        */
        
        //jquery attempt
        var modalPrintTitleEl = $('#recipe-title');
        var modalPrintRecEl = $('#modal-recipe-content');
        var modalTitleEl = $("<h1>")
            .text(response.title);
        console.log(modalTitleEl);
        var modalIngredientEl = $("<div>")
            .text(response.extendedIngredients);
        console.log(modalIngredientEl);
        var modalInstructEl = $("<div>")
            .text(response.instructions);
        console.log(modalInstructEl);
        
        modalTitleEl.appendTo($(modalPrintTitleEl));
        modalIngredientEl.appendTo($(modalPrintRecEl));
        modalInstructEl.appendTo($(modalPrintRecEl));
        //appends
     });
    

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
            .addClass('tile is-child is-info')
            .attr("id", "tile"+i);
        // console.log(recipeTileEl)
        var recipeTileTitleEl = $("<p>")
            .addClass('subtitle')
            .text(response.results[i].title)
        // console.log(recipeTileTitleEl)
        var recipeIdEl = $("<span hidden>")
            .attr("id", "recipe-id")
            .text(response.results[i].id);
        // console.log(recipeIdEl);
        var tileIdEl = $("<span hidden>")
            .attr("id", "tile-id")
            .text(i);
        console.log(tileIdEl);
        var recipeTileFigureEl = $("<figure>")
            .addClass('image is-96x96');
        // console.log(recipeTileFigureEl)
        var recipeTileImgEl = $("<img />")
            .attr("src", response.results[i].image);
        // console.log(recipeTileImgEl)

        recipeTileImgEl.appendTo($(recipeTileFigureEl));
        recipeTileTitleEl.appendTo($(recipeTileEl));
        recipeIdEl.appendTo($(recipeTileEl));
        tileIdEl.appendTo($(recipeTileEl));
        recipeTileFigureEl.appendTo($(recipeTileEl));
        recipeTileEl.appendTo($(recipeEl));
        recipeEl.appendTo($(recipeContainerEl));
    }
}


// When the user clicks on the recipe tile, they are given recipe information in a modal
$(".recipe-tile").click(function() {
    // console.log("clicked");
    var recipeId = $(this).find("span").text();
    $('#recipe-modal').addClass('is-active');
    // console.log(recipeId);
    recipeInformationCall(recipeId);
})

//save recipe
$('#save-recipe').click(function(){
    console.log("save clicked");
    //add save functionality
});

//add to list
//get ingredients and add to an array probably

//forward button
$('#next-button').click(function(){
    //console.log("next");
    var tileID = Document.getElementByID("#tile-id");
    var newTileID = tileID.val() + 1;
    console.log(tileID);

    // may or may not work, not tested
    var tileInQuestion = $("#tile-" + NewtileID) //find new tile id
    recipeId = $(this).find("span").text(); //find recipeID for new tile, problem = looking in span, not whole div add tile number to id in main div, 
    recipeInformationCall(recipeId); //call function to populate modal, which is already active
});

//back button
$('#back-button').click(function(){
    //console.log("back");

});


//close modal
$('#close-modal-x').click(function() {
    //console.log("clicked");
    $('#recipe-modal').removeClass('is-active');
    //call function to set title and recipe to blank strings
})
$('#close-modal-close').click(function() {
    //console.log("clicked");
    $('#recipe-modal').removeClass('is-active');
})

// complexRecipeSearchCall();
