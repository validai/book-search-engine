"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("react-dom/client"));
const react_router_dom_1 = require("react-router-dom");
require("bootstrap/dist/css/bootstrap.min.css");
const App_jsx_1 = __importDefault(require("./App.jsx"));
const SearchBooks_1 = __importDefault(require("./pages/SearchBooks"));
const SavedBooks_1 = __importDefault(require("./pages/SavedBooks"));
const router = (0, react_router_dom_1.createBrowserRouter)([
    {
        path: '/',
        element: <App_jsx_1.default />,
        errorElement: <h1 className='display-2'>Wrong page!</h1>,
        children: [
            {
                index: true,
                element: <SearchBooks_1.default />
            }, {
                path: '/saved',
                element: <SavedBooks_1.default />
            }
        ]
    }
]);
client_1.default.createRoot(document.getElementById('root')).render(<react_router_dom_1.RouterProvider router={router}/>);
