/* All the elements stored here
    are representation of DOM elements
*/

export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchResult: document.querySelector('.results'),
    searchResultList: document.querySelector('.results__list'),
    searchResultPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
};

export const elementStrings = {
    loader: 'loader'
};

// For spinner while we fetching the data
export const renderLoader = parent => {
    const loader = 
    `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
};

// To hide the spinner after getting the data
export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if (loader) loader.parentElement.removeChild(loader);
};