const resultField = document.getElementById('show-result');
let searchInput = document.getElementById('search-input');
const cls = document.getElementById('clsBtn');

const rootDiv = document.createElement('div');
rootDiv.classList.add('mb-3')

const h3 = document.createElement('h3');
const h6 = document.createElement('h6');

// search button click to collect data
const collectData = () => {
    let searchText = searchInput.value;
    resultField.textContent = '';
    if (searchText === '') {
        errorMessage('Search by typing something!')
    } else {
        // searchInput.value = '';
        spinner('block');
        const URL = `https://openlibrary.org/search.json?q=${searchText}`;
        fetch(URL)
            .then(res => res.json())
            .then(data => resultShow(data))
    }
}

// error message
const errorMessage = (text) => {
    searchInput.value = '';
    h3.innerText = text;
    h3.classList.add('error', 'text-center', 'text-danger', 'mt-4');
    rootDiv.appendChild(h3);
    resultField.appendChild(rootDiv);
}

// display result
const resultShow = (data) => {
    resultField.textContent = '';
    totalResultFound(data.numFound);
    displayResult(data.docs);
}

// find total result
const totalResultFound = (numFound) => {
    h6.innerText = `About ${numFound} results found!`;
    h6.classList.add('mb-3')
    resultField.appendChild(h6);
}

// display result as a card
const displayResult = (docs) => {
    let cardDiv = document.createElement('div');
    cardDiv.classList.add('card-parent');
    if (docs === null) {
        errorMessage('Result Not Found!');
    } else {
        docs.forEach(element => {
            const bookTitle = element.title;
            const authorName = element.author_name;

            const cover_i = element.cover_i;
            let imageURL = `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg`;
            if (cover_i === undefined) {
                imageURL = `../image/genericBookCover.jpg`;
            }
            cardDiv = createCard(cardDiv, bookTitle, authorName, imageURL, element.publish_date, element.first_publish_year);
        });
        resultField.appendChild(cardDiv);
        spinner('none');
    }
}

// create card
const createCard = (cardDiv, bookTitle, authorName, imageURL, publish_date, first_publish_year) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.style.width = "18rem";

    const img = document.createElement('img');
    img.src = imageURL;
    img.classList.add('card-image', 'card-img-top')
    img.alt = "../image/genericBookCover.jpg";

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.innerText = `Name: ${bookTitle}`;

    const cardText1 = document.createElement('p');
    cardText1.classList.add('card-text');
    findAuthor(authorName, cardText1)

    const cardText2 = document.createElement('p');
    cardText1.classList.add('card-text');
    findPublishDate(publish_date, first_publish_year, cardText2);

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText1);
    cardBody.appendChild(cardText2);
    card.appendChild(img);
    card.appendChild(cardBody);
    cardDiv.appendChild(card);

    return cardDiv;
}

// find author
const findAuthor = (authorName, cardText) => {
    if (authorName === undefined) {
        cardText.innerText = `
        Author: Did not Find Author,
        `;
    } else {
        let auth = '';
        for (const author in authorName) {
            auth = `${auth} ${authorName[author]},`
        }
        cardText.innerText = `
        Author: ${auth}
        `;
    }
}

// find publish date
const findPublishDate = (publish_date, first_publish_year, cardText) => {
    if (publish_date === undefined && first_publish_year === undefined) {
        cardText.innerText = `Did not find publish date!`
    } else {
        for (const publish in publish_date) {
            let publishDate = publish_date[publish].substr(-4);
            if (publishDate == first_publish_year) {
                cardText.innerText = `First Publish: ${publish_date[publish]}`
            }
            else {
                cardText.innerText = `First Publish: ${first_publish_year}`
            }
        }
    }
}

// show spinner
const spinner = (displayShow) => {
    const spin = document.getElementById('spinner');
    spin.style.display = displayShow;
}

// toggle clear button 
searchInput.addEventListener('keyup', function (event) {
    if (event.keyCode === 8 && event.target.value === "") {
        cls.style.display = 'none';
    } else {
        cls.style.display = 'block';
    }
})

// clear input field
const clearInput = () => {
    searchInput.value = '';
    cls.style.display = 'none';
}