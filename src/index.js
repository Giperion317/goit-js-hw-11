import NewsApiService from './news-servise';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const newsApiService = new NewsApiService();

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(event) {
  event.preventDefault();

  newsApiService.query = event.target.elements.searchQuery.value;

  newsApiService
    .getGalery()
    .then(pictures => console.log(pictures.data.hits))
    .catch(error => console.log(error));
}

function onLoadMore(event) {
  newsApiService
    .getGalery()
    .then(pictures => {
      console.log(pictures.data.hits);
    })
    .catch(error => console.log(error));
}
