import { Route, Routes } from 'react-router-dom';

import HomePage from '../pages/homePage.js';
import LoginPage from '../pages/loginPage.js';
import SignUpPage from '../pages/signUpPage.js';

const Routing = () => {
	return (
		<Routes>
            <Route path='/login' element={<LoginPage/>} />
            <Route path='/signUp' element={<SignUpPage/>} />
			<Route path='/' element={<HomePage/>} />
		</Routes>
	);
};

export default Routing;