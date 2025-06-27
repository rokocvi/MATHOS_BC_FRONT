import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';

import './App.css';
import BookForm from './components/BookForm';
import BookList from './components/BookList';
import BookDetails from './components/BookDetails.jsx';
import BookDetailsList from './components/BookDetailsList.jsx';
import libraryImg from './assets/library.jpg';
import { fetchBooks } from './data/api.jsx';
import { getBookById } from './data/api.jsx'; 

function Home({ books }) {
  return (
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
            <Link to="/books" className="feature-btn">Idite na knjige</Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon">➕</div>
            <h4>Dodajte novu knjigu</h4>
            <p>Proširite svoju kolekciju dodavanjem novih naslova</p>
            <Link to="/add" className="feature-btn">Dodaj knjigu</Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h4>Pretražujte i filtrirajte</h4>
            <p>Lako pronađite knjige po naslovu, autoru ili žanru</p>
            <Link to="/books" className="feature-btn">Pretražite knjige</Link>
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
              Još nema dodanih knjiga.&nbsp;
              <Link to="/add" className="inline-link">Dodajte prvu!</Link>
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
                <Link to="/books" className="view-all-btn">
                  Pogledaj sve knjige ({books.length})
                </Link>
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
  );
}
function EditBookPage() {
  const { id } = useParams();
  const [bookToEdit, setBookToEdit] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadBook() {
      try {
        const res = await getBookById(id);
        setBookToEdit(res.data);
      } catch (error) {
        console.error('Greška pri dohvaćanju knjige:', error);
      }
    }
    loadBook();
  }, [id]);

  const onDone = () => {
    navigate('/books');
  };

  if (!bookToEdit) return <div>Učitavanje...</div>;

  return <BookForm bookToEdit={bookToEdit} onDone={onDone} />;
}
function BooksPage({ setBookToEdit }) {
  return <BookList setBookToEdit={setBookToEdit} />;
}

function AddEditBookPage({ bookToEdit, setBookToEdit }) {
  const navigate = useNavigate();

  const handleDone = () => {
    setBookToEdit(null);
    navigate('/books');
  };

  return <BookForm bookToEdit={bookToEdit} onDone={handleDone} />;
}

function DetailsPage() {
  const [selectedBook, setSelectedBook] = useState(null);

  const handleSelectBook = (book) => {
    setSelectedBook(book);
  };

  const handleBackToDetailsList = () => {
    setSelectedBook(null);
  };

  return (
    <>
      {!selectedBook && <BookDetailsList onSelectBook={handleSelectBook} />}
      {selectedBook && <BookDetails book={selectedBook} onBack={handleBackToDetailsList} />}
    </>
  );
}

function App() {
  const [books, setBooks] = useState([]);
  const [bookToEdit, setBookToEdit] = useState(null);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const response = await fetchBooks();
        setBooks(response.data);
      } catch (error) {
        console.error('Greška pri učitavanju knjiga:', error);
      }
    };
    loadBooks();
  }, []);

  return (
    <Router>
      <div className="app-container">
        <h1>My Library</h1>
        <nav className="navbar">
          <Link to="/">Početna</Link>
          <Link to="/books">Knjige</Link>
          <Link to="/add">Dodaj knjigu</Link>
          <Link to="/details">Detalji knjiga</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home books={books} />} />
          <Route path="/books" element={<BooksPage setBookToEdit={setBookToEdit} />} />
          <Route path="/add" element={<AddEditBookPage bookToEdit={null} setBookToEdit={setBookToEdit} />} />
          <Route path="/edit/:id" element={<EditBookPage />} />
          <Route path="/details" element={<DetailsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
