import axios from 'axios';

export default class Recipe {
    constructor (id) {
        this.id = id;
    }

    // Working of Data  Model
    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.image = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            alert('Oops...Something went wrong !!');
        }
    }

    // To calculate 'cooking time' for selected recipe
    calcTime() {
        // Assuming that we need 15 for 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    // To show the 'servings' for one recipe
    calcServings() {
        this.servings = 4;
    }

    // To handle the 'Ingredients serving' for each recipe
    parseIngredients() {
        // Creating 2 arrays to match them
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(el => {
            // 1. Uniform Units - all needs to be same
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // 2. Remove unnecessary parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3. Parse ingredients into count, unit & ingredients
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(elm => units.includes(elm));

            let objIng;
            // To check all the possibilities for units
            if (unitIndex > -1) {
                // There is a unit for 'Ingredients'
                const arrCount = arrIng.slice(0, unitIndex);
                
                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };

            } else if (parseInt(arrIng[0], 10)) {
                // There is no unit, but 1st element is num
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ') // Array starts from #1
                }
            } else if (unitIndex === -1) {
                // There is no unit & NO num in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }
            return objIng;
        });
        this.ingredients = newIngredients;
    }

    // To update the ingredients & servings for recipe
    updateServings(type) {
        // 1. Updating servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1 ;
        
        // 2. Updating ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }
}