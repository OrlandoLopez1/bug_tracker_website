import React, {useEffect, useState} from 'react';
import {replyToComment, upvoteComment, fetchCommentsForTicket} from "../controllers/CommentController";
import './CommentSection.css'
import {addCommentToTicket, fetchTicket} from "../controllers/TicketController";
import {fetchUser} from "../controllers/UserController";
import {useNavigate, useParams} from "react-router-dom";
import jwtDecode from "jwt-decode";

function CommentSection() {
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const [textareaFocused, setTextareaFocused] = useState(false);
    const [submitFocused, setSubmitFocused] = useState(false);
    const token = localStorage.getItem('accessToken');
    const navigate = useNavigate();
    const [curUserId, setCurUserId] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
        const decodedToken = jwtDecode(token);
        const curUserId = decodedToken.UserInfo.id;
        setCurUserId(curUserId);

        // Fetch comments on component mount
        fetchCommentsForTicket(id, token).then(setComments).catch(console.error);
    }, [navigate, token, id]);



    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };



    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await addCommentToTicket(curUserId, newComment, id, token);
            setNewComment(''); // clear the input
            setTextareaFocused(false); // hide buttons

            // add new comment to the list of comments
            setComments(prevComments => [...prevComments, response.comment]);
        } catch (error) {
            console.error('Failed to post comment:', error);
        }
    };

    return (
        <div className="comment-section">
            <form onSubmit={handleCommentSubmit}>
                <textarea
                    id='textarea'
                    className="comment-input"
                    placeholder="Add a public comment..."
                    value={newComment}
                    onChange={handleCommentChange}
                    onFocus={() => setTextareaFocused(true)}
                    onBlur={() => setTimeout(() => setTextareaFocused(false), 0)}
                />
                <button
                    type="button"
                    className={(textareaFocused || submitFocused) ? 'show-button' : 'hide-button'}
                    onClick={() => {setTextareaFocused(false); setNewComment(''); }}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    id='submit'
                    className={(textareaFocused || submitFocused) ? 'show-button' : 'hide-button'}
                    onFocus={() => setSubmitFocused(true)}
                    onBlur={() => setTimeout(() => setSubmitFocused(false), 0)}
                >
                    Comment
                </button>            </form>
            {comments && comments.length > 0 ? (
                comments.map(comment => <Comment comment={comment} key={comment.id} />)
            ) : (
                <p>No comments</p>
            )}
        </div>
    );
}



function Comment({ comment }) {
    return (
        <div className="comment">
            <div className="author-thumbnail">
                <img src={"/defaultpfp.jpg"} alt={comment.uploader.username} />
            </div>
            <div className="comment-main">
                <div className="comment-header">
                    <h3>
                        <a href={`/channel/${comment.uploader._id}`}>{comment.uploader.username}</a>
                    </h3>
                    <span>{comment.postedAt}</span>
                </div>
                <div className="comment-content">
                    <p>{comment.content}</p>
                </div>
                <div className="comment-actions">
                    <button onClick={() => upvoteComment(comment._id)}>Upvote ({comment.upvotes.length})</button>
                    <button onClick={() => replyToComment(comment._id)}>Reply</button>
                </div>
            </div>
            <div className="replies">
                {comment.replies.map(reply => (
                    <Comment comment={reply} key={reply._id} />
                ))}
            </div>
        </div>
    );
}


export default CommentSection;
