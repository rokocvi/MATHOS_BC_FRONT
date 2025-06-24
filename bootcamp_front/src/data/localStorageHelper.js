const STORAGE_KEY = 'books';


export function getBooks(){
    const books = localStorage.getItem(STORAGE_KEY);
    return books ? JSON.parse(books) : [];
}

export function saveBooks(books){
    localStorage.setItem(STORAGE_KEY,JSON.stringify(books));
}

export function addBook(book){
    const books = getBooks();
    books.push(book);
    saveBooks(books);
}

export function deleteBook(id){
    const books = getBooks().filter(b=>b.id !== id);
    saveBooks(books);
}