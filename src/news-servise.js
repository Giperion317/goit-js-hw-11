import axios from 'axios';

export default class NewsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async getGalery() {
    const BASE_URL = 'https://pixabay.com/api/';
    const option = {
      params: {
        key: '30836581-5201b2d4b86300260b3de2e16',
        q: `${this.searchQuery}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: 100,
        page: this.page,
      },
    };
    const pictures = await axios.get(`${BASE_URL}`, option);
    this.page += 1;
    return pictures;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
