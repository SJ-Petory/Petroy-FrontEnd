import React from 'react';
import PropTypes from 'prop-types';
import FriendList from './FriendList.jsx';

const FriendRequestsList = ({ requests, onRequestAction }) => {
    const handleAccept = (id) => onRequestAction(id, 'ACCEPTED');
    const handleReject = (id) => onRequestAction(id, 'REJECTED');

    return (
        <FriendList 
            friends={requests}
            onAccept={handleAccept}
            onReject={handleReject}
            title="친구 요청 목록"
        />
    );
};

FriendRequestsList.propTypes = {
    requests: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        image: PropTypes.string,
    })).isRequired,
    onRequestAction: PropTypes.func.isRequired,
};

export default FriendRequestsList;