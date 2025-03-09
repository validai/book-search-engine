"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./App.css");
const react_router_dom_1 = require("react-router-dom");
const Navbar_1 = __importDefault(require("./components/Navbar"));
function App() {
    return (<>
      <Navbar_1.default />
      <react_router_dom_1.Outlet />
    </>);
}
exports.default = App;
