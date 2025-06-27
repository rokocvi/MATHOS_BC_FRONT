import axios from 'axios';

const API = axios.create({
    baseURL: 'https://localhost:7091/api'
});

export const fetchBooks = (params) => API.get('/book', {params});

export const getBookById = (id) => API.get(`/book/${id}`);  

export const addBook = (newBook) => API.post('/book', newBook);

export const updateBook = (id, updatedBook) => API.put(`/book/${id}`, updatedBook);


export const deleteBook = (id) => API.delete(`/book/${id}`);








