import React from 'react';
import PropTypes from 'prop-types';
import defaultProfilePic from '../../assets/DefaultImage.png';
import '../../styles/Friend/FriendCard.css';

const FriendCard = ({ id, name, image, onAccept, onReject }) => {
    return (
        <div className="friendCard">
            <div className="friendInfo">
                <h2 className="friendName">{name}</h2>
                {onAccept && (
                    <div className="buttons">
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
                    </div>
                )}
            </div>
            <img 
                src={image || defaultProfilePic} 
                alt={name} 
                className="friendImage" 
            />
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
