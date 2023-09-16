import React, {useEffect, useState} from 'react';
import {replyToComment, upvoteComment, fetchCommentsForTicket, deleteComment} from "../controllers/CommentController";
import './CommentSection.css'
import {addCommentToTicket, fetchTicket} from "../controllers/TicketController";
import {fetchUser} from "../controllers/UserController";
import {useNavigate, useParams} from "react-router-dom";
import jwtDecode from "jwt-decode";
import {deleteAttachment, fetchAttachmentsForTicket, fetchPresignedUrl} from "../controllers/AttachmentController";
//todo issue with cancel buttont
function CommentSection({ curUserObject, isEditingComments, setIsEditingComments }) {
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const [textareaFocused, setTextareaFocused] = useState(false);
    const [submitFocused, setSubmitFocused] = useState(false);
    const token = localStorage.getItem('accessToken');
    const navigate = useNavigate();
    // const [curUserId, setCurUserId] = useState(null);
    const {ticketId} = useParams();
    const [selectedComments, setSelectedComments] = useState([]);

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
        fetchCommentsForTicket(ticketId, token).then(setComments).catch(console.error);
    }, [navigate, token, ticketId]);


    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleCancel = () => {
        setSelectedComments([]);
        setIsEditingComments(false);
    }


    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(curUserObject._id)
            const response = await addCommentToTicket(curUserObject._id, newComment, ticketId, token);
            setNewComment(''); // clear the input
            setTextareaFocused(false); // hide buttons
            setComments(prevComments => [...prevComments, response.comment]);
            console.log("response.comment");
            console.log(response.comment);
        } catch (error) {
            console.error('Failed to post comment:', error);
        }
    };


    const handleSelectAll = () => {
        if (selectedComments.length === comments.length) {
            // Deselect all
            setSelectedComments([]);
        } else {
            // Select all
            setSelectedComments(comments.map(comment => comment._id));
        }
    };

    const handleCommentClick = async (comment) => {
        if (isEditingComments) {
            // In edit mode, clicking an comment toggles its selection
            if (selectedComments.includes(comment._id)) {
                setSelectedComments(selectedComments.filter(id => id !== comment._id));
            } else {
                setSelectedComments([...selectedComments, comment._id]);
            }
        }
    }


    const handleDeleteSelected = async () => {
        for (let commentId of selectedComments) {
            try {
                console.log(commentId)
                await deleteComment(commentId, token);
            } catch (error) {
                console.error(`Failed to delete comment with id ${commentId}:`, error);
            }
        }

        // Refresh the comments list
        const commentData = await fetchCommentsForTicket(ticketId, token);
        setComments(commentData);

        // Clear the selection
        setSelectedComments([]);
    };


    const handleCheckboxClick = (event, comment) => {
        event.stopPropagation();
        if (selectedComments.includes(comment._id)) {
            setSelectedComments(selectedComments.filter(id => id !== comment._id));
        } else {
            setSelectedComments([...selectedComments, comment._id]);
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
                        setSubmitFocused(false);
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
                </button>
            </form>

            {comments && comments.length > 0 ? (
                comments.map(comment => (
                    comment ? (
                        <div className='comment-and-checkbox' key={comment._id}>
                            {isEditingComments &&
                                <input
                                    className="big-checkbox"
                                    type="checkbox"
                                    checked={selectedComments.includes(comment._id)}
                                    onClick={(event) => handleCheckboxClick(event, comment)}
                                    style={{
                                        marginRight: '30px' // scaling and moving the checkbox 10px to the right
                                    }}
                                />
                            }
                            <Comment comment={comment} key={comment.id} curUserObject={curUserObject} token={token} />
                        </div>
                    ) : null
                    ))
            ) : (
                <p>No comments</p>
            )}

            {isEditingComments && (
                <>
                    <div className="delete-comment-buttons">
                        <button onClick={handleCancel}>
                            Cancel
                        </button>
                        <button onClick={handleSelectAll}>
                            Select All
                        </button>
                        <button
                            onClick={handleDeleteSelected}
                            disabled={selectedComments.length === 0}
                        >
                            Delete Selected
                        </button>

                    </div>
                </>
            )}
        </div>
    );
}



function Comment({ comment, curUserObject, token }) {
    return (
        <div className="comment">
            <div className="author-thumbnail">
                <img src={"/defaultpfp.jpg"} alt={curUserObject.username} />
            </div>
            <div className="comment-main">
                <div className="comment-header">
                    <h3>
                        <a href={`/userview/${curUserObject._id}`}>{curUserObject.username}</a>
                    </h3>
                    <span>{comment.postedAt}</span>
                </div>
                <div className="comment-content">
                    <p>{comment.content}</p>
                </div>

            </div>
        </div>
    );
}


export default CommentSection;
