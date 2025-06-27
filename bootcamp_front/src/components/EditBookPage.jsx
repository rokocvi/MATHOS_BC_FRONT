
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBookById } from '../data/api'; // moraš imati ovu funkciju
import BookForm from './BookForm';

function EditBookPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookToEdit, setBookToEdit] = useState(null);

useEffect(() => {
  const loadBook = async () => {
    try {
      const book = await fetchBookById(id);
      setBookToEdit(book);
    } catch (error) {
      console.error("Greška pri dohvaćanju knjige:", error);
    }
  };

  loadBook();
}, [id]);

  return bookToEdit ? (
    <BookForm bookToEdit={bookToEdit} />
  ) : (
    <p>Učitavanje knjige...</p>
  );
}   

export default EditBookPage;
