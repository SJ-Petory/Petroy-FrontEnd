import React from 'react';
import PropTypes from 'prop-types';
import defaultProfilePic from '../../assets/images/DefaultImage.png';
import '../../styles/Friend/FriendCard.css';

const FriendCard = ({ id, name, image, onAccept, onReject }) => { // props로 데이터 전달
    return (
        <div className="friendCard">
            <div className="friendInfo">
                <h2 className="friendName">{name}</h2>
                
                {onAccept && ( // onAccept 함수가 전달된 경우
                    <div className="buttons">
                        <button 
                            onClick={() => onAccept(id)} // 수락 버튼 클릭 시 onAccept 함수 호출
                            className="accept-button"
                        >
                            수락
                        </button>
                        <button 
                            onClick={() => onReject(id)} // 거절 버튼 클릭 시 onReject 함수 호출
                            className="reject-button"
                        >
                            거절
                        </button>
                    </div>
                )}
            </div>
            <img 
                src={image || defaultProfilePic} // 이미지가 없으면 기본 프로필 이미지 사용
                alt={name} // 이미지 대체 텍스트
                className="friendImage" 
            />
        </div>
    );
};

// PropTypes로 props의 타입을 정의
FriendCard.propTypes = {
    id: PropTypes.string.isRequired, // id는 문자열이고 필수
    name: PropTypes.string.isRequired, // name은 문자열이고 필수
    image: PropTypes.string, // image는 문자열
    onAccept: PropTypes.func, // onAccept는 함수로 전달
    onReject: PropTypes.func, // onReject는 함수로 전달
};

export default FriendCard; 
