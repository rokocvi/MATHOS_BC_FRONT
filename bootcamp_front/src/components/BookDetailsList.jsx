import React, { useEffect, useState } from 'react';
import { fetchBooks } from '../data/api';
import './BookDetailsList.css';


function BookDetailsList({ onSelectBook }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const response = await fetchBooks();
        setBooks(response.data);
      } catch (error) {
        console.error("Greška pri učitavanju knjiga", error);
      }
    };

    loadBooks();
  }, []);

  return (
    <div className='book-details-list'>
      <h2>Detalji knjiga</h2>
      {books.length === 0 ? (
        <p>Nema knjiga za prikaz.</p>
      ) : (
        <ul>
          {books.map(book => (
            <li key={book.id}>
              <strong>{book.title}</strong> by {book.author}
              <button onClick={() => onSelectBook(book)}>Detalji</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BookDetailsList;
