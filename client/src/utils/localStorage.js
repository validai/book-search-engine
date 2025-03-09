"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeBookId = exports.saveBookIds = exports.getSavedBookIds = void 0;
const getSavedBookIds = () => {
    const savedBookIds = localStorage.getItem('saved_books')
        ? JSON.parse(localStorage.getItem('saved_books'))
        : [];
    return savedBookIds;
};
exports.getSavedBookIds = getSavedBookIds;
const saveBookIds = (bookIdArr) => {
    if (bookIdArr.length) {
        localStorage.setItem('saved_books', JSON.stringify(bookIdArr));
    }
    else {
        localStorage.removeItem('saved_books');
    }
};
exports.saveBookIds = saveBookIds;
const removeBookId = (bookId) => {
    const savedBookIds = localStorage.getItem('saved_books')
        ? JSON.parse(localStorage.getItem('saved_books'))
        : null;
    if (!savedBookIds) {
        return false;
    }
    const updatedSavedBookIds = savedBookIds === null || savedBookIds === void 0 ? void 0 : savedBookIds.filter((savedBookId) => savedBookId !== bookId);
    localStorage.setItem('saved_books', JSON.stringify(updatedSavedBookIds));
    return true;
};
exports.removeBookId = removeBookId;
