const genres = [];
const years = [];
const languages = [];
let allBooks = [];
let favorites = [];
let currentSortType = null;
let currentSortDirection = null;
let isViewingFavorites = false;


fetch('books.json')
    .then(r => {
    if(!r.ok){
        throw new Error("Помилка при завантаженні файлу");
    }
    return r.json();
})
    .then(array => {
        allBooks = array;
        array.forEach(book => {
            const bookCard = document.createElement("div");
            bookCard.classList.add("book-card");
            bookCard.innerHTML = `<img src="${book.image}" alt="${book.title}">
                                  <h3 class="book-title">${book.title}</h3>
                                  <p class="book-author">${book.author}</p>`;
            document.querySelector('.books-grid').appendChild(bookCard);
            genres.push(book.genre);
            years.push(book.year);
            languages.push(book.lang);
            bookCard.onclick = () => openPopup(book);
        });
        const uniqueGenres = browseGenres(genres);
        for(const genre of uniqueGenres){
            const label = document.createElement("label");
            label.classList.add("checkbox-label");
            const checkbox = document.createElement("input")
            checkbox.type = "checkbox";
            checkbox.classList.add("genre");
            checkbox.value = genre;

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(" " + genre));
            document.querySelector(".sub-genres").appendChild(label);
        }
        const uniqueYears = browseYears(years);
        for(const year of uniqueYears){
            const label = document.createElement("label");
            label.classList.add("checkbox-label");
            const checkbox = document.createElement("input")
            checkbox.type = "checkbox";
            checkbox.classList.add("year");
            checkbox.value = year;

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(" " + year));
            document.querySelector(".sub-year").appendChild(label);
        }
        const uniqueLanguages = browseLanguages(languages);
        for(const language of uniqueLanguages){
            const label = document.createElement("label");
            label.classList.add("checkbox-label");
            const checkbox = document.createElement("input")
            checkbox.type = "checkbox";
            checkbox.classList.add("lang");
            checkbox.value = language;

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(" " + language));
            document.querySelector(".sub-language").appendChild(label);
        }
        const checkboxes = document.querySelectorAll('.genre, .year, .lang');
        for (let i = 0; i < checkboxes.length; i++) {
            checkboxes[i].addEventListener('change', filterBooks);
        }
        document.querySelector('.author').addEventListener('keydown', function(e){
            if(e.key === 'Enter'){
                filterBooks();
            }
        });
        document.querySelector('.sorting').addEventListener('change', function() {
            const value = this.value;
            if (!allBooks.length){
                return;
            }
            if (value === "a-z") {
                currentSortType = "title";
                currentSortDirection = "up";
            } else if (value === "z-a") {
                currentSortType = "title";
                currentSortDirection = "down";
            } else if (value === "1-9") {
                currentSortType = "year";
                currentSortDirection = "up";
            } else if (value === "9-1") {
                currentSortType = "year";
                currentSortDirection = "down";
            } else if (value === "none") {
                currentSortType = null;
                currentSortDirection = null;
            } else if (value === "genre-a-z") {
                currentSortType = "genre";
                currentSortDirection = "up";
            } else if (value === "genre-z-a") {
                currentSortType = "genre";
                currentSortDirection = "down";
            }

            const filtered = filterBooks();
            if(currentSortType && currentSortDirection){
                sortBooks(filtered, currentSortType, currentSortDirection);
            }
            renderBooks(filtered);
        });

        document.querySelector('.popup-close').addEventListener('click', () => {
            document.querySelector('.popup').classList.add('hidden');
        });

        const popup = document.querySelector('.popup');
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.classList.add('hidden');
            }
        });

        document.querySelector('.show-favorites').onclick = () => {
            if(favorites.length === 0) {
                return;
            }
            isViewingFavorites = true;
            renderBooks(favorites);
            document.querySelector('.show-favorites').classList.add('hidden');
            document.querySelector('.show-all').classList.remove('hidden');
        };

        document.querySelector('.show-all').onclick = () => {
            isViewingFavorites = false;
            renderBooks(allBooks);
            document.querySelector('.show-favorites').classList.remove('hidden');
            document.querySelector('.show-all').classList.add('hidden');
        };

        document.getElementById('filterBtn').addEventListener('click', () => {
            const sidePanel = document.querySelector('.side-panel');
            sidePanel.classList.toggle('mobile-active');
        });


    })
    .catch(error => {
        console.error("Помилка", error)
    })

function browseGenres(genresArray) {
    const result = [];

    for (let i = 0; i < genresArray.length; i++) {
        const genreString = genresArray[i];
        const split = genreString.split(',');

        for (let j = 0; j < split.length; j++) {
            const genreForCompare = split[j].trim().toLowerCase();
            const capitalized = genreForCompare.charAt(0).toUpperCase() + genreForCompare.slice(1);

            if (!result.includes(capitalized)) {
                result.push(capitalized);
            }
        }
    }

    return result.sort((a, b) => a.localeCompare(b));
}

function browseYears(yearsArray) {
    const result = [];

    for (let i = 0; i < yearsArray.length; i++) {
        const year = yearsArray[i];
        if (!result.includes(year)) {
            result.push(year);
        }

    }
    return result.sort((a, b) => a.localeCompare(b));
}

function browseLanguages(languagesArray) {
    const result = [];

    for (let i = 0; i < languagesArray.length; i++) {
        const language = languagesArray[i].toLowerCase();
        const capitalized = language.charAt(0).toUpperCase() + language.slice(1);

        if (!result.includes(capitalized)) {
            result.push(capitalized);
        }
    }

    return result.sort((a, b) => a.localeCompare(b));
}

function renderBooks(books) {
    const grid = document.querySelector('.books-grid');
    grid.innerHTML = '';
    for (let i = 0; i < books.length; i++) {
        const book = books[i];
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');
        bookCard.innerHTML = '<img src="' + book.image + '" alt="' + book.title + '">' +
            '<h3 class="book-title">' + book.title + '</h3>' +
            '<p class="book-author">' + book.author + '</p>';
        bookCard.onclick = () => openPopup(book);
        grid.appendChild(bookCard);
    }
}

function filterBooks() {
    const genresChecked = document.querySelectorAll('.genre:checked');
    const yearsChecked = document.querySelectorAll('.year:checked');
    const langsChecked = document.querySelectorAll('.lang:checked');
    const authorValue = document.querySelector('.author').value.toLowerCase().trim();

    const filtered = [];

    const source = isViewingFavorites ? favorites : allBooks;
    for (let i = 0; i < source.length; i++) {
        const book = source[i];

        let genreMatch = true;
        for (let j = 0; j < genresChecked.length; j++) {
            const genreValue = genresChecked[j].value.toLowerCase();
            if (!book.genre.toLowerCase().includes(genreValue)) {
                genreMatch = false;
                break;
            }
        }
        if (genresChecked.length === 0) {
            genreMatch = true;
        }


        let yearMatch = yearsChecked.length === 0;
        for (let j = 0; j < yearsChecked.length; j++) {
            if (book.year === yearsChecked[j].value) {
                yearMatch = true;
                break;
            }
        }

        let langMatch = langsChecked.length === 0;
        for (let j = 0; j < langsChecked.length; j++) {
            const langValue = langsChecked[j].value.toLowerCase();
            if (book.lang.toLowerCase().includes(langValue)) {
                langMatch = true;
                break;
            }
        }

        const authorMatch = authorValue === '' || book.author.toLowerCase().includes(authorValue);

        if (genreMatch && yearMatch && langMatch && authorMatch) {
            filtered.push(book);
        }
    }

    if(currentSortType && currentSortDirection){
        sortBooks(filtered, currentSortType, currentSortDirection);
    }

    renderBooks(filtered);
    updateActiveFilters();
    return filtered;
}

function createFilterChip(label, remove) {
    const chip = document.createElement("div");
    chip.classList.add("filter-chip");

    const text = document.createElement("span");
    text.textContent = label;

    const button = document.createElement("button");
    button.innerHTML = '×';
    button.addEventListener("click", remove);

    chip.appendChild(text);
    chip.appendChild(button);

    return chip;
}

function updateActiveFilters() {
    const container = document.querySelector('.active-filters');
    container.innerHTML = '';

    const genresChecked = document.querySelectorAll('.genre:checked');
    for (let i = 0; i < genresChecked.length; i++) {
        const chip = createFilterChip('Жанр: ' + genresChecked[i].value, function () {
            genresChecked[i].checked = false;
            filterBooks();
        });
        container.appendChild(chip);
    }

    const yearsChecked = document.querySelectorAll('.year:checked');
    for (let i = 0; i < yearsChecked.length; i++) {
        const chip = createFilterChip('Рік: ' + yearsChecked[i].value, function () {
            yearsChecked[i].checked = false;
            filterBooks();
        });
        container.appendChild(chip);
    }

    const langsChecked = document.querySelectorAll('.lang:checked');
    for (let i = 0; i < langsChecked.length; i++) {
        const chip = createFilterChip('Мова: ' + langsChecked[i].value, function () {
            langsChecked[i].checked = false;
            filterBooks();
        });
        container.appendChild(chip);
    }

    const authorInput = document.querySelector('.author');
    const authorValue = authorInput.value.trim();
    if (authorValue !== '') {
        const chip = createFilterChip('Автор: ' + authorValue, function () {
            authorInput.value = '';
            filterBooks();
        });
        container.appendChild(chip);
    }
}

function sortBooks(books, type, direction){
    if(type==="title"){
        books.sort(function(a,b){
            if(direction === "up"){
                if(a.title.toLowerCase()<b.title.toLowerCase()){
                    return -1;
                }
                if(a.title.toLowerCase()>b.title.toLowerCase()){
                    return 1;
                }
                return 0;
            } else {
                if(a.title.toLowerCase()<b.title.toLowerCase()){
                    return 1;
                }
                if(a.title.toLowerCase()>b.title.toLowerCase()){
                    return -1;
                }
                return 0;
            }
        });
    } else if (type==="year"){
        books.sort(function(a, b) {
            if (direction === "up") {
                return parseInt(a.year) - parseInt(b.year);
            } else {
                return parseInt(b.year) - parseInt(a.year);
            }
        });
    } else if(type === "genre"){
        books.sort(function(a, b){
            const genreA = a.genre.split(',')[0].trim().toLowerCase();
            const genreB = b.genre.split(',')[0].trim().toLowerCase();

            if(genreA < genreB){
                return direction === "up" ? -1 : 1;
            } else if (genreA > genreB){
                return direction === "up" ? 1 : -1;
            } else {
                return 0;
            }
        });
    }

}

function openPopup(book) {
    const popup = document.querySelector('.popup');
    popup.querySelector('.popup-title').textContent = book.title;
    popup.querySelector('.popup-author').textContent = 'Автор: ' + book.author;
    popup.querySelector('.popup-genre').textContent = 'Жанр: ' + book.genre;
    popup.querySelector('.popup-year').textContent = 'Рік: ' + book.year;
    popup.querySelector('.popup-lang').textContent = 'Мова: ' + book.lang;
    popup.classList.remove('hidden');

    const addFavBtn = popup.querySelector('.add-favorite');

    if (favorites.includes(book)) {
        addFavBtn.textContent = 'Видалити з улюблених';
        addFavBtn.onclick = () => {
            favorites = favorites.filter(fav => fav !== book);
            popup.classList.add('hidden');
        };
    } else {
        addFavBtn.textContent = 'Додати до улюблених';
        addFavBtn.onclick = () => {
            favorites.push(book);
            popup.classList.add('hidden');
        };
    }
}
