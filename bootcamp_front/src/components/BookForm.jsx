import React, { useState, useEffect } from 'react';
import { addBook, updateBook } from '../data/localStorageHelper';
import './BookForm.css';

function BookForm({ bookToEdit, onDone }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (bookToEdit) {
      setTitle(bookToEdit.title || '');
      setAuthor(bookToEdit.author || '');
      setStatus(bookToEdit.status || '');
    } else {
      setTitle('');
      setAuthor('');
      setStatus('');
    }
  }, [bookToEdit]);

  function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim() || !author.trim()) {
      alert('Please enter both title and author.');
      return;
    }

    const bookData = {
      id: bookToEdit ? bookToEdit.id : Date.now(),
      title: title.trim(),
      author: author.trim(),
      status: status,
    };

    if (bookToEdit) {
      updateBook(bookData);
    } else {
      addBook(bookData);
    }

    onDone(); // Vrati na listu knjiga ili gde već
  }

  return (
    <form onSubmit={handleSubmit} className="book-form">
      <h2>{bookToEdit ? 'Edit Book' : 'Add New Book'}</h2>

      <input
        type="text"
        placeholder="Book Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={e => setAuthor(e.target.value)}
      />
      <select value={status} onChange={e => setStatus(e.target.value)}>
        <option value="">Select status</option>
        <option value="za čitanje">Za čitanje</option>
        <option value="čitam">Čitam</option>
        <option value="pročitano">Pročitano</option>
      </select>

      <button type="submit">{bookToEdit ? 'Update Book' : 'Add Book'}</button>
    </form>
  );
}

export default BookForm;
