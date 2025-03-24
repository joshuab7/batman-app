import React, { useState } from 'react';

const StarRating = ({ initialRating = 0, onRatingChange }) => {
    const [rating, setRating] = useState(initialRating);
    const [hoverRating, setHoverRating] = useState(0);
    
    const handleClick = (newRating) => {
        setRating(newRating);
        onRatingChange(newRating);
    };
    return (
        <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
            <button
            key={star}
            type="button"
            className={`star-button ${star <= (hoverRating || rating) ? 'filled' : ''}`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            >
            ★
            </button>
        ))}
        <span className="rating-display">
            {rating > 0 ? `Your rating: ${rating}/5` : 'Not rated yet'}
        </span>
        </div>
    );
};

export default StarRating;