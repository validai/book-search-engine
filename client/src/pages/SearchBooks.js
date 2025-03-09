"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_bootstrap_1 = require("react-bootstrap");
const auth_1 = __importDefault(require("../utils/auth"));
const API_1 = require("../utils/API");
const localStorage_1 = require("../utils/localStorage");
const SearchBooks = () => {
    // create state for holding returned google api data
    const [searchedBooks, setSearchedBooks] = (0, react_1.useState)([]);
    // create state for holding our search field data
    const [searchInput, setSearchInput] = (0, react_1.useState)('');
    // create state to hold saved bookId values
    const [savedBookIds, setSavedBookIds] = (0, react_1.useState)((0, localStorage_1.getSavedBookIds)());
    // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
    // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
    (0, react_1.useEffect)(() => {
        return () => (0, localStorage_1.saveBookIds)(savedBookIds);
    });
    // create method to search for books and set state on form submit
    const handleFormSubmit = (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        if (!searchInput) {
            return false;
        }
        try {
            const response = yield (0, API_1.searchGoogleBooks)(searchInput);
            if (!response.ok) {
                throw new Error('something went wrong!');
            }
            const { items } = yield response.json();
            const bookData = items.map((book) => {
                var _a;
                return ({
                    bookId: book.id,
                    authors: book.volumeInfo.authors || ['No author to display'],
                    title: book.volumeInfo.title,
                    description: book.volumeInfo.description,
                    image: ((_a = book.volumeInfo.imageLinks) === null || _a === void 0 ? void 0 : _a.thumbnail) || '',
                });
            });
            setSearchedBooks(bookData);
            setSearchInput('');
        }
        catch (err) {
            console.error(err);
        }
    });
    // create function to handle saving a book to our database
    const handleSaveBook = (bookId) => __awaiter(void 0, void 0, void 0, function* () {
        // find the book in `searchedBooks` state by the matching id
        const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
        // get token
        const token = auth_1.default.loggedIn() ? auth_1.default.getToken() : null;
        if (!token) {
            return false;
        }
        try {
            const response = yield (0, API_1.saveBook)(bookToSave, token);
            if (!response.ok) {
                throw new Error('something went wrong!');
            }
            // if book successfully saves to user's account, save book id to state
            setSavedBookIds([...savedBookIds, bookToSave.bookId]);
        }
        catch (err) {
            console.error(err);
        }
    });
    return (<>
      <div className="text-light bg-dark p-5">
        <react_bootstrap_1.Container>
          <h1>Search for Books!</h1>
          <react_bootstrap_1.Form onSubmit={handleFormSubmit}>
            <react_bootstrap_1.Row>
              <react_bootstrap_1.Col xs={12} md={8}>
                <react_bootstrap_1.Form.Control name='searchInput' value={searchInput} onChange={(e) => setSearchInput(e.target.value)} type='text' size='lg' placeholder='Search for a book'/>
              </react_bootstrap_1.Col>
              <react_bootstrap_1.Col xs={12} md={4}>
                <react_bootstrap_1.Button type='submit' variant='success' size='lg'>
                  Submit Search
                </react_bootstrap_1.Button>
              </react_bootstrap_1.Col>
            </react_bootstrap_1.Row>
          </react_bootstrap_1.Form>
        </react_bootstrap_1.Container>
      </div>

      <react_bootstrap_1.Container>
        <h2 className='pt-5'>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <react_bootstrap_1.Row>
          {searchedBooks.map((book) => {
            return (<react_bootstrap_1.Col md="4" key={book.bookId}>
                <react_bootstrap_1.Card border='dark'>
                  {book.image ? (<react_bootstrap_1.Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top'/>) : null}
                  <react_bootstrap_1.Card.Body>
                    <react_bootstrap_1.Card.Title>{book.title}</react_bootstrap_1.Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <react_bootstrap_1.Card.Text>{book.description}</react_bootstrap_1.Card.Text>
                    {auth_1.default.loggedIn() && (<react_bootstrap_1.Button disabled={savedBookIds === null || savedBookIds === void 0 ? void 0 : savedBookIds.some((savedBookId) => savedBookId === book.bookId)} className='btn-block btn-info' onClick={() => handleSaveBook(book.bookId)}>
                        {(savedBookIds === null || savedBookIds === void 0 ? void 0 : savedBookIds.some((savedBookId) => savedBookId === book.bookId))
                        ? 'This book has already been saved!'
                        : 'Save this Book!'}
                      </react_bootstrap_1.Button>)}
                  </react_bootstrap_1.Card.Body>
                </react_bootstrap_1.Card>
              </react_bootstrap_1.Col>);
        })}
        </react_bootstrap_1.Row>
      </react_bootstrap_1.Container>
    </>);
};
exports.default = SearchBooks;
