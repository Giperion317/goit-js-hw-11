import './css/styles.css';

import NewsApiService from './news-servise';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const newsApiService = new NewsApiService();

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(event) {
  event.preventDefault();

  newsApiService.query = event.target.elements.searchQuery.value.trim();

  if (newsApiService.query === '') {
    clearGallery();
    console.log('Fill in the search bar!');
    return;
  }

  newsApiService.resetPage();
  clearGallery();

  newsApiService
    .getGalery()
    .then(({ hits, totalHits }) => {
      if (hits.length === 0) {
        console.log(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      if (totalHits / newsApiService.per_page > 1) {
        loadMoreBtn.classList.remove('invisible');
      }
      console.log(hits);
      createGallery(hits);
    })
    .catch(error => console.log(error));
}

function onLoadMore() {
  newsApiService.incrementPage();
  newsApiService
    .getGalery()
    .then(({ hits, totalHits }) => {
      console.log(Math.ceil(totalHits / newsApiService.per_page));
      if (
        Math.ceil(totalHits / newsApiService.per_page) === newsApiService.page
      ) {
        loadMoreBtn.classList.add('invisible');
      }
      console.log(hits);
      createGallery(hits);
    })
    .catch(error => console.log(error));
}

function createGallery(pictures) {
  const markup = pictures
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" class="image-card"/>
  <div class="info">
    <p class="info-item">
    <b>Likes</b><span class="info-value">${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b><span class="info-value">${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b><span class="info-value">${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b><span class="info-value">${downloads}</span>
    </p>
  </div>
</div>`
    )
    .join();

  gallery.insertAdjacentHTML('beforeend', markup);
}

function clearGallery() {
  gallery.innerHTML = '';
}
