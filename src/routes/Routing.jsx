import { Route, Routes } from 'react-router-dom';


import HomePage from '../pages/homePage.jsx';
import LoginPage from '../pages/loginPage.jsx';
import SignUpPage from '../pages/signUpPage.jsx';
import MainPage from '../pages/mainPage.jsx';


const Routing = () => {

	return (
		<Routes>
            <Route path='/login' element={<LoginPage/>} />
            <Route path='/signUp' element={<SignUpPage/>} />
			<Route path='/mainPage' element={<MainPage/>} />
			<Route path='/' element={<HomePage/>} />
		</Routes>
	);
};

export default Routing;