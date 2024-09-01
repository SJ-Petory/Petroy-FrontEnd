import React from 'react';
import PropTypes from 'prop-types';
import defaultProfilePic from '../../assets/DefaultImage.png';
import '../../styles/Friend/friendCard.css'; 

const FriendCard = ({ id, name, image, onAccept, onReject }) => {
    return (
        <div className="friendCard">
            <img 
                src={image || defaultProfilePic} 
                alt={name} 
                className="friendImage" 
            />
            <h2>{name}</h2>
            {onAccept && (
                <>
                    <button 
                        onClick={() => onAccept(id)} 
                        className="accept-button"
                    >
                        수락
                    </button>
                    <button 
                        onClick={() => onReject(id)} 
                        className="reject-button"
                    >
                        거절
                    </button>
                </>
            )}
        </div>
    );
};

FriendCard.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
    onAccept: PropTypes.func,
    onReject: PropTypes.func,
};

export default FriendCard;
