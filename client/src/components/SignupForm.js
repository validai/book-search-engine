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
// biome-ignore lint/correctness/noEmptyPattern: <explanation>
const SignupForm = ({}) => {
    // set initial form state
    const [userFormData, setUserFormData] = (0, react_1.useState)({ username: '', email: '', password: '', savedBooks: [] });
    // set state for form validation
    const [validated] = (0, react_1.useState)(false);
    // set state for alert
    const [showAlert, setShowAlert] = (0, react_1.useState)(false);
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserFormData(Object.assign(Object.assign({}, userFormData), { [name]: value }));
    };
    const handleFormSubmit = (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        // check if form has everything (as per react-bootstrap docs)
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        try {
            const response = yield (0, API_1.createUser)(userFormData);
            if (!response.ok) {
                throw new Error('something went wrong!');
            }
            const { token } = yield response.json();
            auth_1.default.login(token);
        }
        catch (err) {
            console.error(err);
            setShowAlert(true);
        }
        setUserFormData({
            username: '',
            email: '',
            password: '',
            savedBooks: [],
        });
    });
    return (<>
      {/* This is needed for the validation functionality above */}
      <react_bootstrap_1.Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {/* show alert if server response is bad */}
        <react_bootstrap_1.Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your signup!
        </react_bootstrap_1.Alert>

        <react_bootstrap_1.Form.Group className='mb-3'>
          <react_bootstrap_1.Form.Label htmlFor='username'>Username</react_bootstrap_1.Form.Label>
          <react_bootstrap_1.Form.Control type='text' placeholder='Your username' name='username' onChange={handleInputChange} value={userFormData.username || ''} required/>
          <react_bootstrap_1.Form.Control.Feedback type='invalid'>Username is required!</react_bootstrap_1.Form.Control.Feedback>
        </react_bootstrap_1.Form.Group>

        <react_bootstrap_1.Form.Group className='mb-3'>
          <react_bootstrap_1.Form.Label htmlFor='email'>Email</react_bootstrap_1.Form.Label>
          <react_bootstrap_1.Form.Control type='email' placeholder='Your email address' name='email' onChange={handleInputChange} value={userFormData.email || ''} required/>
          <react_bootstrap_1.Form.Control.Feedback type='invalid'>Email is required!</react_bootstrap_1.Form.Control.Feedback>
        </react_bootstrap_1.Form.Group>

        <react_bootstrap_1.Form.Group className='mb-3'>
          <react_bootstrap_1.Form.Label htmlFor='password'>Password</react_bootstrap_1.Form.Label>
          <react_bootstrap_1.Form.Control type='password' placeholder='Your password' name='password' onChange={handleInputChange} value={userFormData.password || ''} required/>
          <react_bootstrap_1.Form.Control.Feedback type='invalid'>Password is required!</react_bootstrap_1.Form.Control.Feedback>
        </react_bootstrap_1.Form.Group>
        <react_bootstrap_1.Button disabled={!(userFormData.username && userFormData.email && userFormData.password)} type='submit' variant='success'>
          Submit
        </react_bootstrap_1.Button>
      </react_bootstrap_1.Form>
    </>);
};
exports.default = SignupForm;
