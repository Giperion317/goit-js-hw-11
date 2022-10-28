import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

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
    Notify.info('Fill in the search bar!');
    return;
  }

  newsApiService.resetPage();
  clearGallery();

  newsApiService
    .getGalery()
    .then(({ hits, totalHits }) => {
      if (hits.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      if (totalHits / newsApiService.per_page > 1) {
        loadMoreBtn.classList.remove('invisible');
      }
      createGallery(hits);
    })
    .catch(error => Notify.failure(error));
}

function onLoadMore() {
  newsApiService.incrementPage();
  newsApiService
    .getGalery()
    .then(({ hits, totalHits }) => {
      if (
        Math.ceil(totalHits / newsApiService.per_page) === newsApiService.page
      ) {
        loadMoreBtn.classList.add('invisible');
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
      createGallery(hits);
      flowScroll();
    })
    .catch(error => Notify.failure(error));
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
      <a href="${largeImageURL}" class="gallery-item">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" class="image-card"/>
  </a>
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
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);

  liteBox();
}

function clearGallery() {
  gallery.innerHTML = '';
}

function liteBox() {
  const liteBox = new SimpleLightbox('.gallery-item', {
    captionsData: 'alt',
    captionDelay: 250,
  });
  liteBox.refresh();
}

function flowScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 3,
    behavior: 'smooth',
  });
}
