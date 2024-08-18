import { Route, Routes } from 'react-router-dom';

import HomePage from '../pages/homePage.jsx';
import LoginPage from '../pages/loginPage.jsx';
import SignUpPage from '../pages/signUpPage.jsx';
import MainPage from '../pages/mainPage.jsx';
import MyPage from '../pages/myPage.jsx';
import PetPage from '../pages/petPage.jsx';  
import KakaoCallback from '../utils/kakaoCallback.jsx'; 

const Routing = () => {

	return (
		<Routes>
            <Route path='/login' element={<LoginPage/>} />
            <Route path='/signUp' element={<SignUpPage/>} />
			<Route path='/oauth/kakao/callback' element={<KakaoCallback />} /> 
			<Route path='/mainPage' element={<MainPage/>} />
			<Route path='/myPage' element={<MyPage/>} />
			<Route path='/petPage' element={<PetPage/>} />
			<Route path='/' element={<HomePage/>} />
            
		</Routes>
	);
};

export default Routing;
