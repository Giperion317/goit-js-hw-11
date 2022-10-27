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
    .then(pictures => {
      console.log(pictures);
      if (pictures.length === 0) {
        console.log(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      createGallery(pictures);
    })
    .catch(error => console.log(error));
}

function onLoadMore() {
  newsApiService.incrementPage();
  newsApiService
    .getGalery()
    .then(pictures => {
      console.log(pictures);
      createGallery(pictures);
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
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
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
