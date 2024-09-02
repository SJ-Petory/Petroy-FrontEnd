import React from 'react';
import PropTypes from 'prop-types';
import FriendCard from './FriendCard.jsx';
import '../../styles/Friend/FriendsList.css'; 

const FriendList = ({ friends, onAccept, onReject, title }) => {
    return (
        <div className="friendsListContainer">
            <h2>{title}</h2>
            {friends.length > 0 ? (
                <div className="friendsList">
                    {friends.map(friend => (
                        <FriendCard 
                            key={friend.id}
                            id={friend.id}
                            name={friend.name}
                            image={friend.image}
                            onAccept={onAccept}
                            onReject={onReject}
                        />
                    ))}
                </div>
            ) : (
                <p>{title === '친구 목록' ? '친구가 없습니다.' : '친구 요청이 없습니다.'}</p>
            )}
        </div>
    );
};

FriendList.propTypes = {
    friends: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        image: PropTypes.string,
    })).isRequired,
    onAccept: PropTypes.func,
    onReject: PropTypes.func,
    title: PropTypes.string.isRequired,
};

export default FriendList;