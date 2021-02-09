import React, {useState} from 'react';
import "./Post.css";
import Avatar from '@material-ui/core/Avatar';


function Post({username, caption,imageUrl}) {

    const [comments,setComments]=useState([]);

    return (
        <div className="post">
            <div className="post__header">
                <Avatar
                className="post__avatar"
                alt="Samir"
                src="/static/images/avatar/1.jpg" />
                <h3>{username}</h3>
            </div>
            <img
                className="post__image" 
                src={imageUrl}
            />
            <h4 className="post__text"><strong>{username}</strong>{caption}</h4>

            <div className="post__comments">
                {comments.map((comment)=>(
                    <p>
                    <strong>{comment.username}</strong>{comment.text}
                 </p>
                ))}
            </div>

        </div>
    )
}

export default Post
