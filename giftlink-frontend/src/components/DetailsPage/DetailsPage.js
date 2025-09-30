import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import { useCart } from '../../contexts/CartContext';
import './DetailsPage.css';

function DetailsPage() {
    const navigate = useNavigate();
    const { productId } = useParams();
    const { addToCart } = useCart();
    const [gift, setGift] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [commentAuthor, setCommentAuthor] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const { isLoggedIn, userName } = useAppContext();

	useEffect(() => {
        // get the gift to be rendered on the details page
        const fetchGift = async () => {
            try {
				// Task 2: Fetch gift details
                const response = await fetch(`${urlConfig.backendUrl}/api/gifts/${productId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setGift(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        // Fetch comments for this gift
        const fetchComments = async () => {
            try {
                const response = await fetch(`${urlConfig.backendUrl}/api/comments/${productId}`);
                if (response.ok) {
                    const data = await response.json();
                    setComments(data);
                }
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchGift();
        fetchComments();

		// Task 3: Scroll to top on component mount
		window.scrollTo(0, 0);

        // Set author from logged-in user
        if (isLoggedIn) {
            setCommentAuthor(userName);
        }

    }, [productId, navigate, isLoggedIn, userName]);


    const handleBackClick = () => {
		// Task 4: Handle back click
		navigate(-1);
	};

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        if (!isLoggedIn) {
            alert('Please login to add a comment');
            navigate('/app/login');
            return;
        }

        if (!newComment.trim()) {
            alert('Please enter a comment');
            return;
        }

        setSubmittingComment(true);

        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    giftId: productId,
                    author: commentAuthor,
                    comment: newComment
                })
            });

            if (!response.ok) {
                throw new Error('Failed to add comment');
            }

            const data = await response.json();

            // Add new comment to the list
            setComments([...comments, data.comment]);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment. Please try again.');
        } finally {
            setSubmittingComment(false);
        }
    };

    const getSentimentBadge = (sentiment) => {
        const badgeColors = {
            positive: 'success',
            negative: 'danger',
            neutral: 'secondary'
        };
        return `badge bg-${badgeColors[sentiment] || 'secondary'}`;
    };


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!gift) return <div>Gift not found</div>;

return (
        <div className="container mt-5">
            <button className="btn btn-secondary mb-3" onClick={handleBackClick}>Back</button>
            <div className="card product-details-card">
                <div className="card-header">
                    <h2 className="details-title">{gift.name}</h2>
                </div>
                <div className="card-body">
                    <div className="image-placeholder-large">
                        {gift.image ? (
                            <img src={gift.image} alt={gift.name} className="img-fluid" />
                        ) : (
                            <div className="no-image-available-large">No Image Available</div>
                        )}
                    </div>
                    <p><strong>Category:</strong> {gift.category}</p>
                    <p><strong>Condition:</strong> {gift.condition}</p>
                    <p><strong>Date Added:</strong> {new Date(gift.date_added * 1000).toLocaleDateString()}</p>
                    <p><strong>Age (Years):</strong> {gift.age_years}</p>
                    <p><strong>Description:</strong> {gift.description}</p>

                    <button onClick={() => { addToCart(gift); alert('Added to cart!'); }} className="btn btn-success buy-btn-details mt-3">
                        <span className="btn-icon">🛒</span> Add to Cart
                    </button>
                </div>
            </div>

            <div className="comments-section mt-4">
                <h3 className="mb-3">Comments</h3>

                {/* Add Comment Form */}
                {isLoggedIn && (
                    <div className="card mb-3 bg-light">
                        <div className="card-body">
                            <h5>Add a Comment</h5>
                            <form onSubmit={handleCommentSubmit}>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Your name"
                                        value={commentAuthor}
                                        onChange={(e) => setCommentAuthor(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        placeholder="Write your comment..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={submittingComment}
                                >
                                    {submittingComment ? 'Submitting...' : 'Submit Comment'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Display Comments */}
                {comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <div key={comment._id || index} className="card mb-3">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start">
                                    <p className="comment-author"><strong>{comment.author}:</strong></p>
                                    {comment.sentiment && (
                                        <span className={getSentimentBadge(comment.sentiment)}>
                                            {comment.sentiment}
                                        </span>
                                    )}
                                </div>
                                <p className="comment-text">{comment.comment}</p>
                                {comment.timestamp && (
                                    <small className="text-muted">
                                        {new Date(comment.timestamp).toLocaleString()}
                                    </small>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-muted">No comments yet. Be the first to comment!</p>
                )}
            </div>
        </div>
    );
}

export default DetailsPage;