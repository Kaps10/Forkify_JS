import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];    // An empty array where recipe stored
    }
    
    // Add item to shopping list
    addItem (count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }

    // Delete item to shopping list
    deleteItem (id) {
        // Finding the index id for selected item
        const index = this.items.findIndex(el => el.id === id);
        // 1 indicates we want to remove 1 element
        this.items.splice(index, 1);
    }

    // Update the shopping list
    updateCount (id, newCount   ) {
        this.items.find(el => el.id === id).count = newCount;
    }
}