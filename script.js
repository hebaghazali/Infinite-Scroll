const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];

// Unsplash API
const initialCount = 20;
const count = 50;
const apiKey = 'ju8W-mmQ9K3JKg--iAjXxl5PJU5_jAq2kgoyG5F56vQ';
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialCount}`;

// Check if all images were loaded
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
    apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;
  }
}

// Show API error message
function requestError() {
  loader.hidden = true;
  const h3 = document.createElement('h3');
  h3.innerHTML = `<div style="color: red; font-size: 1.5rem">Oops, we ran out of requests.</div> Please wait for the next hour to get 50 more requests.`;
  h3.style.textAlign = 'center';
  h3.style.fontSize = '1rem';
  imageContainer.insertAdjacentElement('afterend', h3);
}

// Create Elements For Links & Photos, Add to DOM
function displayPhotos() {
  imagesLoaded = 0;
  totalImages = photosArray.length;

  // Run function for each object in photosArray
  photosArray.forEach(photo => {
    try {
      // Standardize the size as much as possible using the if condition
      if (photo.width / photo.height < 0.67) {
        // Create <a> to link to Unsplash
        const item = document.createElement('a');
        item.href = photo.links.html;
        item.target = '_blank';

        // Create <img> for photo
        const img = document.createElement('img');
        img.src = photo.urls.thumb;
        img.alt = photo.alt_description;
        img.title = photo.alt_description;

        // Create a figure caption to show location of photo
        const figure = document.createElement('figure');
        const figcaption = document.createElement('figcaption');

        if (photo.location.name !== null) {
          figcaption.innerText = `${photo.location.name}`;
          figcaption.href = '#';
        }

        // Event listener, check when each is finished loading
        img.addEventListener('load', imageLoaded);

        // Put <img> inside <a>, then put both inside imageContainer Element
        figure.appendChild(img);
        figure.appendChild(figcaption);
        item.appendChild(figure);
        imageContainer.appendChild(item);
      } else {
        imageLoaded();
      }
    } catch (error) {
      requestError();
    }
  });
}

// Get photos from Unsplash API
async function getPhotos() {
  try {
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    displayPhotos();
  } catch (error) {
    requestError();
  }
}

// Check to see if scrolling near bottom of page, Load More Photos
window.addEventListener('scroll', () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    ready
  ) {
    ready = false;
    getPhotos();
  }
});

// On Load
getPhotos();
