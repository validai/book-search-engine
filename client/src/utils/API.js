"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchGoogleBooks = exports.deleteBook = exports.saveBook = exports.loginUser = exports.createUser = exports.getMe = void 0;
// route to get logged in user's info (needs the token)
const getMe = (token) => {
    return fetch('/api/users/me', {
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
        },
    });
};
exports.getMe = getMe;
const createUser = (userData) => {
    return fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
};
exports.createUser = createUser;
const loginUser = (userData) => {
    return fetch('/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
};
exports.loginUser = loginUser;
// save book data for a logged in user
const saveBook = (bookData, token) => {
    return fetch('/api/users', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookData),
    });
};
exports.saveBook = saveBook;
// remove saved book data for a logged in user
const deleteBook = (bookId, token) => {
    return fetch(`/api/users/books/${bookId}`, {
        method: 'DELETE',
        headers: {
            authorization: `Bearer ${token}`,
        },
    });
};
exports.deleteBook = deleteBook;
// make a search to google books api
// https://www.googleapis.com/books/v1/volumes?q=harry+potter
const searchGoogleBooks = (query) => {
    return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};
exports.searchGoogleBooks = searchGoogleBooks;
