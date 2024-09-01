import { Route, Routes } from 'react-router-dom';
import HomePage from '../pages/Home/homePage.jsx';
import LoginPage from '../pages/Login/loginPage.jsx';
import SignUpPage from '../pages/SignUp/signUpPage.jsx';
import InputInfo from '../pages/SignUp/inputInfo.jsx';
import MainPage from '../pages/Main/mainPage.jsx';
import MyPage from '../pages/MyPage/myPage.jsx';
import PetPage from '../pages/Pet/petPage.jsx';  
import FriendPage from '../pages/Friend/friendPage.jsx';

const Routing = () => {

	return (
		<Routes>
            <Route path='/login' element={<LoginPage/>} />
			<Route path='/inputInfo' element={<InputInfo/>} />
            <Route path='/signUp' element={<SignUpPage/>} />
			<Route path='/mainPage' element={<MainPage/>} />
			<Route path='/myPage' element={<MyPage/>} />
			<Route path='/petPage' element={<PetPage/>} />
			<Route path='/friendPage' element={<FriendPage/>} /> 
			<Route path='/' element={<HomePage/>} />
            
		</Routes>
	);
};

export default Routing;

