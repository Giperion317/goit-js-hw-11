import axios from 'axios';

const API_KEY = '30836581-5201b2d4b86300260b3de2e16';
const BASE_URL = 'https://pixabay.com/api/';

export default class NewsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 20;
  }

  async getGalery() {
    const options = {
      params: {
        key: API_KEY,
        q: `${this.searchQuery}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: this.per_page,
        page: this.page,
      },
    };
    const pictures = await axios.get(`${BASE_URL}?`, options);
    return pictures.data;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
