import React, { useState, useEffect } from 'react';
import { addBook, updateBook } from "../data/api"; 
import './BookForm.css';

function BookForm({ bookToEdit, onDone }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState('');
  const [authorId, setAuthorId] = useState(null);      
  const [libraryId, setLibraryId] = useState(null);     
  const [rating, setRating] = useState(0);              

  useEffect(() => {
    if (bookToEdit) {
      setTitle(bookToEdit.title || '');
      setAuthor(bookToEdit.author || '');
      setStatus(bookToEdit.status || '');
      setAuthorId(bookToEdit.authorId ?? null);
      setLibraryId(bookToEdit.libraryId ?? null);
      setRating(bookToEdit.rating ?? 0);
    } else {
      setTitle('');
      setAuthor('');
      setStatus('');
      setAuthorId(null);
      setLibraryId(null);
      setRating(0);
    }
  }, [bookToEdit]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim() || !author.trim()) {
      console.log('Nedostaju naslov ili autor.');
      return;
    }

    const bookData = {
      title: title.trim(),
      author: author.trim(),
      status: status.trim(),
      authorId: authorId !== null ? authorId : null,
      libraryId: libraryId !== null ? libraryId : null,
      rating: rating
    };

    try {
      if (bookToEdit) {
        console.log("Šaljem update za knjigu:", bookToEdit.id, bookData);
        await updateBook(bookToEdit.id, bookData);
        console.log("Update uspješan");
      } else {
        console.log("Šaljem dodavanje knjige:", bookData);
        await addBook(bookData);
        console.log("Dodavanje uspješno");
      }
      onDone();
    } catch (error) {
      console.error("Greška pri čuvanju knjige:", error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="book-form">
      <h2>{bookToEdit ? 'Edit Book' : 'Add New Book'}</h2>

      <input
        type="text"
        placeholder="Book Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={e => setAuthor(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Status"
        value={status}
        onChange={e => setStatus(e.target.value)}
      />
      <input
        type="number"
        placeholder="Author ID"
        value={authorId !== null ? authorId : ''}
        onChange={e => setAuthorId(e.target.value ? parseInt(e.target.value) : null)}
        min="0"
      />
      <input
        type="number"
        placeholder="Library ID"
        value={libraryId !== null ? libraryId : ''}
        onChange={e => setLibraryId(e.target.value ? parseInt(e.target.value) : null)}
        min="0"
      />
      <input
        type="number"
        placeholder="Rating"
        value={rating}
        onChange={e => setRating(e.target.value ? parseFloat(e.target.value) : 0)}
        min="0"
        max="5"
        step="0.1"
      />

      <button type="submit">{bookToEdit ? 'Update Book' : 'Add Book'}</button>
    </form>
  );
}

export default BookForm;