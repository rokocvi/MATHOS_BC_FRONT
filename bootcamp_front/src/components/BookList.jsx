import React, { useEffect, useState } from 'react';
import './BookList.css';
import { fetchBooks, deleteBook } from '../data/api';

function BookList({ setActivePage, setBookToEdit }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [books, setBooks] = useState([]);
  const [allGenres, setAllGenres] = useState([]);

  useEffect(() => {
    loadBooks();
  }, [searchTerm, statusFilter, genreFilter]);

  const loadBooks = async () => {
    try {
      const response = await fetchBooks({
        titleFilter: searchTerm,
        status: statusFilter,
        genre: genreFilter // koristi ako backend podržava, ako ne možeš ignorirati
      });

      let filteredBooks = response.data;

      // Frontend filter za žanr ako backend ne podržava
      if (genreFilter) {
        filteredBooks = filteredBooks.filter(book =>
          book.genres.some(genre => genre.name === genreFilter)
        );
      }

      setBooks(filteredBooks);

      // Generiranje liste svih žanrova iz svih knjiga
      const genresSet = new Set();
      response.data.forEach(book => {
        book.genres.forEach(genre => genresSet.add(genre.name));
      });
      setAllGenres(Array.from(genresSet).sort());

    } catch (error) {
      console.error("Greška pri učitavanju knjiga", error);
    }
  };

  async function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id);
        loadBooks(); // ponovno učitaj knjige nakon brisanja
      } catch (error) {
        console.error("Greška pri brisanju knjiga", error);
      }
    }
  }

  function clearFilters() {
    setSearchTerm('');
    setStatusFilter('');
    setGenreFilter(''); // reset i za žanr
  }

  return (
    <div className='books-list'>
      <h2>All Books</h2>

      <div className="filters">
        <input
          type="text"
          className="search-input"
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-filter"
        >
          <option value="">All statuses</option>
          <option value="za čitanje">Za čitanje</option>
          <option value="čitam">Čitam</option>
          <option value="pročitano">Pročitano</option>
        </select>

        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          className="genre-filter"
        >
          <option value="">All genres</option>
          {allGenres.map((genre, index) => (
            <option key={index} value={genre}>{genre}</option>
          ))}
        </select>

        {(searchTerm || statusFilter || genreFilter) && (
          <button onClick={clearFilters} className="clear-btn">
            Clear
          </button>
        )}
      </div>

      {books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <>
          <p>Prikazano {books.length} knjiga</p>
          <ul>
            {books.map(book => (
              <li key={book.id}>
                <div className="book-info">
                  <strong>{book.title}</strong> by {book.author}
                  {book.status && <span className="status"> ({book.status})</span>}
                  {book.genres.length > 0 && (
                    <span className="genres"> | Žanrovi: {book.genres.map(g => g.name).join(', ')}</span>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(book.id)}
                  className='delete-button'
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setBookToEdit(book);
                    setActivePage('edit');
                  }}
                  className='edit-button'
                >
                  Update
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default BookList;
