import React, { useEffect, useState } from 'react';
import './App.css';
import BookForm from './components/BookForm';
import BookList from './components/BookList';
import libraryImg from './assets/library.jpg';
import { fetchBooks } from './data/api.jsx';
import BookDetails from './components/BookDetails.jsx';
import BookDetailsList from './components/BookDetailsList.jsx';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [bookToEdit, setBookToEdit] = useState(null);
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null); // Za detaljni prikaz

  // Učitaj knjige svaki put kad se promijeni activePage
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const response = await fetchBooks(); // poziva backend
        setBooks(response.data); // postavi podatke
      } catch (error) {
        console.error('Greška pri učitavanju knjiga:', error);
      }
    };

    loadBooks();
  }, [activePage]);

  // Funkcija za odabir knjige za detaljni prikaz
  const handleSelectBook = (book) => {
    setSelectedBook(book);
  };

  // Povratak sa detalja na listu detalja
  const handleBackToDetailsList = () => {
    setSelectedBook(null);
  };

  return (
    <div className="app-container">
      <h1>My Library</h1>
      <nav className="navbar">
        <button onClick={() => { setActivePage('home'); setSelectedBook(null); }}>Početna</button>
        <button onClick={() => { setActivePage('books'); setSelectedBook(null); }}>Knjige</button>
        <button onClick={() => { setActivePage('add'); setSelectedBook(null); }}>Dodaj knjigu</button>
        <button onClick={() => { setActivePage('details'); setSelectedBook(null); }}>Detalji knjiga</button>
      </nav>

      {activePage === 'home' && (
        <div className="home-page">
          <div className="hero-section">
            <img src={libraryImg} alt="Library" className="library-image" />
            <div className="welcome-text">
              <h2>Dobrodošli u vašu personalnu knjižnicu!</h2>
              <p>Organizirajte, pratite i upravljajte vašom kolekcijom knjiga na jednom mjestu.</p>
            </div>
          </div>

          <div className="features-section">
            <h3>Što možete raditi:</h3>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">📚</div>
                <h4>Pregledajte knjige</h4>
                <p>Vidite sve knjige u vašoj kolekciji</p>
                <button onClick={() => setActivePage('books')} className="feature-btn">
                  Idite na knjige
                </button>
              </div>

              <div className="feature-card">
                <div className="feature-icon">➕</div>
                <h4>Dodajte novu knjigu</h4>
                <p>Proširite svoju kolekciju dodavanjem novih naslova</p>
                <button onClick={() => setActivePage('add')} className="feature-btn">
                  Dodaj knjigu
                </button>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🔍</div>
                <h4>Pretražujte i filtrirajte</h4>
                <p>Lako pronađite knjige po naslovu, autoru ili žanru</p>
                <button onClick={() => setActivePage('books')} className="feature-btn">
                  Pretražite knjige
                </button>
              </div>
            </div>
          </div>

          <div className="stats-section">
            <h3>Statistike vaše knjižnice</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{books.length}</div>
                <div className="stat-label">Ukupno knjiga</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{books.filter(book => book.status === 'pročitano').length}</div>
                <div className="stat-label">Pročitano</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{books.filter(book => book.status === 'za čitanje').length}</div>
                <div className="stat-label">Za čitanje</div>
              </div>
            </div>
          </div>

          <div className="recent-activity">
            <h3>Nedavno dodane knjige</h3>
            <div className="recent-books">
              {books.length === 0 ? (
                <p className="no-books">
                  Još nema dodanih knjiga. 
                  <button onClick={() => setActivePage('add')} className="inline-link">
                    Dodajte prvu!
                  </button>
                </p>
              ) : (
                <div className="recent-books-list">
                  {books.slice(-3).reverse().map((book, index) => (
                    <div key={book.id || index} className="recent-book-item">
                      <div className="book-info">
                        <h4>{book.title || book.naslov}</h4>
                        <p>{book.author || book.autor}</p>
                        <span className={`status-badge ${(book.status || 'nepoznato').replace(' ', '-')}`}>
                          {book.status || 'Nepoznato'}
                        </span>
                      </div>
                    </div>
                  ))}
                  {books.length > 3 && (
                    <button onClick={() => setActivePage('books')} className="view-all-btn">
                      Pogledaj sve knjige ({books.length})
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="quote-section">
            <blockquote>
              <p>"Knjiga je san koji držite u rukama."</p>
              <cite>— Neil Gaiman</cite>
            </blockquote>
          </div>
        </div>
      )}

      {activePage === 'books' && (
        <BookList
          setActivePage={setActivePage}
          setBookToEdit={setBookToEdit}
        />
      )}

      {(activePage === 'add' || activePage === 'edit') && (
        <BookForm
          bookToEdit={activePage === 'edit' ? bookToEdit : null}
          onDone={() => setActivePage('books')}
        />
      )}

      {activePage === 'details' && !selectedBook && (
        <BookDetailsList onSelectBook={handleSelectBook} />
      )}

      {activePage === 'details' && selectedBook && (
        <BookDetails book={selectedBook} onBack={handleBackToDetailsList} />
      )}
    </div>
  );
}

export default App;
