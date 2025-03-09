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
const API_1 = require("../utils/API");
const auth_1 = __importDefault(require("../utils/auth"));
const localStorage_1 = require("../utils/localStorage");
const SavedBooks = () => {
    const [userData, setUserData] = (0, react_1.useState)({
        username: '',
        email: '',
        password: '',
        savedBooks: [],
    });
    // use this to determine if `useEffect()` hook needs to run again
    const userDataLength = Object.keys(userData).length;
    (0, react_1.useEffect)(() => {
        const getUserData = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const token = auth_1.default.loggedIn() ? auth_1.default.getToken() : null;
                if (!token) {
                    return false;
                }
                const response = yield (0, API_1.getMe)(token);
                if (!response.ok) {
                    throw new Error('something went wrong!');
                }
                const user = yield response.json();
                setUserData(user);
            }
            catch (err) {
                console.error(err);
            }
        });
        getUserData();
    }, [userDataLength]);
    // create function that accepts the book's mongo _id value as param and deletes the book from the database
    const handleDeleteBook = (bookId) => __awaiter(void 0, void 0, void 0, function* () {
        const token = auth_1.default.loggedIn() ? auth_1.default.getToken() : null;
        if (!token) {
            return false;
        }
        try {
            const response = yield (0, API_1.deleteBook)(bookId, token);
            if (!response.ok) {
                throw new Error('something went wrong!');
            }
            const updatedUser = yield response.json();
            setUserData(updatedUser);
            // upon success, remove book's id from localStorage
            (0, localStorage_1.removeBookId)(bookId);
        }
        catch (err) {
            console.error(err);
        }
    });
    // if data isn't here yet, say so
    if (!userDataLength) {
        return <h2>LOADING...</h2>;
    }
    return (<>
      <div className='text-light bg-dark p-5'>
        <react_bootstrap_1.Container>
          {userData.username ? (<h1>Viewing {userData.username}'s saved books!</h1>) : (<h1>Viewing saved books!</h1>)}
        </react_bootstrap_1.Container>
      </div>
      <react_bootstrap_1.Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <react_bootstrap_1.Row>
          {userData.savedBooks.map((book) => {
            return (<react_bootstrap_1.Col md='4'>
                <react_bootstrap_1.Card key={book.bookId} border='dark'>
                  {book.image ? (<react_bootstrap_1.Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top'/>) : null}
                  <react_bootstrap_1.Card.Body>
                    <react_bootstrap_1.Card.Title>{book.title}</react_bootstrap_1.Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <react_bootstrap_1.Card.Text>{book.description}</react_bootstrap_1.Card.Text>
                    <react_bootstrap_1.Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </react_bootstrap_1.Button>
                  </react_bootstrap_1.Card.Body>
                </react_bootstrap_1.Card>
              </react_bootstrap_1.Col>);
        })}
        </react_bootstrap_1.Row>
      </react_bootstrap_1.Container>
    </>);
};
exports.default = SavedBooks;
