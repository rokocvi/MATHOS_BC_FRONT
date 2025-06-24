import React, { useState } from 'react';
import { getBooks, deleteBook } from '../data/localStorageHelper';

function BookList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const books = getBooks();

  function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this book?')) {
      deleteBook(id);
      window.location.reload();
    }
  }

  // Filtriraj knjige prema searchTerm i statusu
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || book.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  function handleSearchChange(e) {
    setSearchTerm(e.target.value);
  }

  function handleStatusChange(e) {
    setStatusFilter(e.target.value);
  }

  function clearFilters() {
    setSearchTerm('');
    setStatusFilter('');
  }

  return (
    <div className='books-list'>
      <h2>All Books ({books.length})</h2>
      
      <div className="filters">
        <input
          type="text"
          className="search-input"
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        
        <select 
          value={statusFilter} 
          onChange={handleStatusChange}
          className="status-filter"
        >
          <option value="">All statuses</option>
          <option value="za čitanje">Za čitanje</option>
          <option value="čitam">Čitam</option>
          <option value="pročitano">Pročitano</option>
        </select>

        {(searchTerm || statusFilter) && (
          <button onClick={clearFilters} className="clear-btn">
            Clear
          </button>
        )}
      </div>

      <p className="results-count">
        Showing {filteredBooks.length} of {books.length} books
      </p>

      {filteredBooks.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <ul>
          {filteredBooks.map(book => (
            <li key={book.id}>
              <div className="book-info">
                <strong>{book.title}</strong> by {book.author}
                {book.status && <span className="status">({book.status})</span>}
              </div>
              <button 
                onClick={() => handleDelete(book.id)} 
                className='delete-button'
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BookList;