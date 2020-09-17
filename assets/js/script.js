// Recipe Search Scripts

var searchTerm = "japanese curry";

// Spoonacular API

// complex recipe search: https://spoonacular.com/food-api/docs#Search-Recipes-Complex 
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
    console.log(response.results[0].title)
    console.log(response.results[0].image)

    displayRecipeResults(response);

});



var displayRecipeResults = function(response) {
    var recipeContainerEl = $("#recipe-content").addClass("tile is-ancestor")
    console.log(recipeContainerEl)
    for (i=0;i<Object.keys(response.results).length;i++) {
        var recipeEl = $("<div>").addClass('tile is-parent is-2');
        console.log(recipeEl)
        var recipeTileEl = $("<article>").addClass('tile is-child is-info');
        console.log(recipeTileEl)
        var recipeTileTitleEl = $("<p>").addClass('subtitle').text(response.results[i].title);
        console.log(recipeTileTitleEl)
        var recipeTileFigureEl = $("<figure>").addClass('image is-96x96');
        console.log(recipeTileFigureEl)
        var recipeTileImgEl = $("<img />")
            .attr("src", response.results[i].image);
        console.log(recipeTileImgEl)

        recipeTileImgEl.appendTo($(recipeTileFigureEl));
        recipeTileTitleEl.appendTo($(recipeTileEl));
        recipeTileFigureEl.appendTo($(recipeTileEl));
        recipeTileEl.appendTo($(recipeEl));
        recipeEl.appendTo($(recipeContainerEl));
    }
}
