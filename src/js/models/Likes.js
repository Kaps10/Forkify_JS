import uniqid from 'uniqid';

export default class Likes {
    constructor() {
        this.likes = [];    // An empty array where recipe stored
    }

    // Add Liked recipe to favorites
    addLike (id, title, author, image) {
        const like = {id, title, author, image};
        this.likes.push(like);

        // Persist data in 'localStorage()'
        this.persistData();

        return like;
    }

    // Delete liked recipe from favorites
    deleteLike (id) {
        // Finding the index id for selected item
        const index = this.likes.findIndex(el => el.id === id);
        // '1' indicates we want to remove '1' element
        this.likes.splice(index, 1);

        // Persist data in 'localStorage()'
        this.persistData();
    }

    // To check whether we have liked recipe or not
    isLiked (id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    // To get the exact num of liked recipes
    getNumLikes () {
        return this.likes.length;
    }

    // Method to store data in 'localStorage()'
    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    // Method to retrieve data in 'localStorage()'
    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        
        // Restoring the likes from the 'localStorage'
        if (storage) this.likes = storage;
    }
}