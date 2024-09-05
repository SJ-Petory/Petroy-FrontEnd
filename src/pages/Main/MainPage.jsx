import '../../styles/Main/MainPage.css';
import { fetchCurrentMember } from '../../services/TokenService.jsx';
import CalendarComponent from '../../components/commons/CalendarComponent.jsx';
import NavBar from '../../components/commons/NavBar.jsx';

function MainPage() {

    return (
        <div className="main-page">
            <NavBar title="메인페이지" />
            <CalendarComponent />
        </div>
    );
}

export default MainPage;
