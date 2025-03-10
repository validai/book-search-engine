"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// use this to decode a token and get the user's information out of it
const jwt_decode_1 = require("jwt-decode");
// create a new class to instantiate for a user
class AuthService {
    // get user data
    getProfile() {
        return (0, jwt_decode_1.jwtDecode)(this.getToken() || '');
    }
    // check if user's logged in
    loggedIn() {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token); // handwaiving here
    }
    // check if token is expired
    isTokenExpired(token) {
        try {
            const decoded = (0, jwt_decode_1.jwtDecode)(token);
            if (decoded.exp < Date.now() / 1000) {
                return true;
            }
            return false;
        }
        catch (err) {
            return false;
        }
    }
    getToken() {
        // Retrieves the user token from localStorage
        return localStorage.getItem('id_token');
    }
    login(idToken) {
        // Saves user token to localStorage
        localStorage.setItem('id_token', idToken);
        window.location.assign('/');
    }
    logout() {
        // Clear user token and profile data from localStorage
        localStorage.removeItem('id_token');
        // this will reload the page and reset the state of the application
        window.location.assign('/');
    }
}
exports.default = new AuthService();
