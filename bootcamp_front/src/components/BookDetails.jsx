import './BookDetails.css';



function BookDetails({ book, onBack }) {
  if (!book) return null;

  return (
    <div className="book-details">
      <h2>Detalji knjige</h2>
      <p><strong>Naslov:</strong> {book.title}</p>
      <p><strong>Autor:</strong>{book.author}</p>
      <p><strong>Rating:</strong>{book.rating}</p>
      <button onClick={onBack}>Natrag na listu</button>
    </div>
  );
}

export default BookDetails;
//autor, status, rating