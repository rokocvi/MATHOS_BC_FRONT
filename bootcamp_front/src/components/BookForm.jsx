import React from 'react';
import { addBook } from '../data/localStorageHelper';

function BookForm() {
  function handleSubmit(e) {
    e.preventDefault();
    const title = e.target.title.value;
    const author = e.target.author.value;

    if (!title || !author) return;

    const newBook = {
      id: Date.now(),
      title,
      author,
    };

    addBook(newBook);
    e.target.reset();
    window.location.reload(); 
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="title" placeholder="Book Title" />
      <input type="text" name="author" placeholder="Author" />
      <button type="submit">Add Book</button>
    </form>
  );
}

export default BookForm;
