import React, { useEffect, useState } from 'react';
import './BookList.css';
import { fetchBooks, deleteBook } from '../data/api';
import { useNavigate } from 'react-router-dom';

function BookList({ setActivePage, setBookToEdit }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [books, setBooks] = useState([]);
  const [allGenres, setAllGenres] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadBooks();
  }, [searchTerm, statusFilter, genreFilter]);

  const loadBooks = async () => {
    try {
      const response = await fetchBooks({
        titleFilter: searchTerm,
        status: statusFilter,
        genre: genreFilter
      });

      let filteredBooks = response.data;

      if (genreFilter) {
        filteredBooks = filteredBooks.filter(book =>
          book.genres.some(genre => genre.name === genreFilter)
        );
      }

      setBooks(filteredBooks);

      // Skupi sve žanrove za dropdown
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
        loadBooks(); 
      } catch (error) {
        console.error("Greška pri brisanju knjiga", error);
      }
    }
  }

  const handleEditClick = (book) => {
    navigate(`/edit/${book.id}`);
  };

  function clearFilters() {
    setSearchTerm('');
    setStatusFilter('');
    setGenreFilter('');
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
                  onClick={() => handleEditClick(book)}
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
