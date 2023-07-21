import React, {useEffect, useState} from 'react';
import {replyToComment, upvoteComment, fetchCommentsForTicket} from "../controllers/CommentController";
import './CommentSection.css'
import {addCommentToTicket, fetchTicket} from "../controllers/TicketController";
import {fetchUser} from "../controllers/UserController";
import {useNavigate, useParams} from "react-router-dom";
import jwtDecode from "jwt-decode";
//todo issue with cancel button
function CommentSection(curUserObject) {
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const [textareaFocused, setTextareaFocused] = useState(false);
    const [submitFocused, setSubmitFocused] = useState(false);
    const token = localStorage.getItem('accessToken');
    const navigate = useNavigate();
    // const [curUserId, setCurUserId] = useState(null);
    const { ticketId } = useParams();

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }


        // Fetch comments on component mount
        fetchCommentsForTicket(ticketId, token).then(setComments).catch(console.error);
    }, [navigate, token, ticketId]);



    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };



    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(curUserObject.curUserObject._id)
            const response = await addCommentToTicket(curUserObject.curUserObject._id, newComment, ticketId, token);
            setNewComment(''); // clear the input
            setTextareaFocused(false); // hide buttons
            setComments(prevComments => [...prevComments, response.comment]);
            console.log("response.comment");
            console.log(response.comment);
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
                    className={textareaFocused || submitFocused ? 'show-button' : 'hide-button'}
                    onClick={() => {
                        setTextareaFocused(false);
                        setNewComment('');
                    }}
                    onFocus={() => setSubmitFocused(true)}
                    onBlur={() => setTimeout(() => setSubmitFocused(false), 0)}
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
                comments.map(comment => <Comment comment={comment} key={comment.id} curUserObject={curUserObject} token={token} />)
            ) : (
                <p>No comments</p>
            )}
        </div>
    );
}



function Comment({ comment, curUserObject, token }) {
    return (
        <div className="comment">
            <div className="author-thumbnail">
                <img src={"/defaultpfp.jpg"} alt={curUserObject.curUserObject.username} />
            </div>
            <div className="comment-main">
                <div className="comment-header">
                    <h3>
                        {/*{console.log("uploader: ", comment.uploader)}*/}
                        <a href={`/channel/${curUserObject.curUserObject._id}`}>{curUserObject.curUserObject.username}</a>
                    </h3>
                    <span>{comment.postedAt}</span>
                </div>
                <div className="comment-content">
                    <p>{comment.content}</p>
                </div>
                <div className="comment-actions">
                    <button onClick={() => upvoteComment(comment._id, curUserObject.curUserObject._id, token)}>Upvote ({comment.upvotes.length})</button>
                    <button onClick={() => replyToComment(comment._id, curUserObject.curUserObject._id, token)}>Reply</button>
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
