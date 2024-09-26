const placesList = document.getElementById('places-list');
const pagination = document.getElementById('pagination');
const sortSelect = document.getElementById('sort');
const filterLocationInput = document.getElementById('filter-location');
const applyFiltersBtn = document.getElementById('apply-filters');

let places = [];
let currentPage = 1;
const placesPerPage = 3;
const API_KEY = 'kIhS6QKxdFjznFfAh9V9Y5TyLg3Pb9_1wHLXnhgmcgc'; // Insert your Unsplash API key here

// Fetch data from JSON file
fetch('places.json')
    .then(response => response.json())
    .then(data => {
        places = data;
        displayPlaces(places, currentPage);
        setupPagination(places.length);
        fetchLocationImages();  // Fetch images directly after data is loaded
    });

// Display places
function displayPlaces(places, page) {
    placesList.innerHTML = '';
    const start = (page - 1) * placesPerPage;
    const end = start + placesPerPage;
    const paginatedPlaces = places.slice(start, end);

    paginatedPlaces.forEach(place => {
        const placeCard = document.createElement('div');
        placeCard.classList.add('place-card');
        placeCard.innerHTML = `
            <h3>${place.name}</h3>
            <p>${place.description}</p>
            <p>Location: ${place.location}</p>
            <p>Rating: ${place.rating}</p>
            <p>Price: $${place.price}</p>
            <div class="location-image" id="image-${place.id}"></div> <!-- Image section -->
        `;
        placesList.appendChild(placeCard);
    });
}

// Setup pagination
function setupPagination(totalPlaces) {
    pagination.innerHTML = '';
    const totalPages = Math.ceil(totalPlaces / placesPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayPlaces(places, currentPage);
            fetchLocationImages();  // Re-fetch images for the paginated content
        });
        pagination.appendChild(pageButton);
    }
}

// Sort and filter places
applyFiltersBtn.addEventListener('click', () => {
    const sortBy = sortSelect.value;
    const filterLocation = filterLocationInput.value.toLowerCase();

    let filteredPlaces = places;

    // Filter by location
    if (filterLocation) {
        filteredPlaces = places.filter(place => place.location.toLowerCase().includes(filterLocation));
    }

    // Sort places
    filteredPlaces.sort((a, b) => {
        if (sortBy === 'rating') {
            return b.rating - a.rating;
        } else if (sortBy === 'price') {
            return a.price - b.price;
        }
    });

    displayPlaces(filteredPlaces, 1);
    setupPagination(filteredPlaces.length);
    fetchLocationImages();  // Re-fetch images after sorting and filtering
});

// Fetch location images from Unsplash API
function fetchLocationImages() {
    places.forEach(place => {
        const location = place.location;

        fetch(`https://api.unsplash.com/search/photos?query=${location}&client_id=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
                const imageDiv = document.getElementById(`image-${place.id}`);
                if (data.results.length > 0) {
                    const imgUrl = data.results[0].urls.small;
                    imageDiv.innerHTML = `<img src="${imgUrl}" alt="${location} image" />`;
                } else {
                    imageDiv.textContent = 'No image available';
                }
            })
            .catch(error => console.error('Error fetching image:', error));
    });
}
