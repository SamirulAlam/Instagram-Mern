import React, { useState,useEffect } from "react";
import './App.css';
import Post from "./Post";
import {auth, db} from "./firebase";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button,Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";
import axios from "./axios";
import Pusher from "pusher-js"

function getModalStyle() {
  const top = 50;
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes=useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts,setPosts]=useState([]);
  const [open,setOpen]=useState(false);
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const [email,setEmail]=useState("");
  const [user,setUser]=useState(null);
  const [openSignIn,setOpenSignIn]=useState(false);

  useEffect(()=>{
    const unsubscribe=auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        console.log(authUser);
        setUser(authUser);
      }
      else{
        setUser(null);
      }
    })
    return()=>{
      unsubscribe();
    }

  },[user,username]);

  const fetchPosts=async () => axios.get("/sync").then(response=>{
    console.log(response);
    setPosts(response.data);
  });

  useEffect(()=>{
    const pusher = new Pusher('34874447bdbad0e0f1bf', {
      cluster: 'ap2'
    });

    const channel = pusher.subscribe('posts');
    channel.bind('inserted', (data)=> {
      fetchPosts();
    });
  },[])

  useEffect(()=>{
    fetchPosts();
  },[]);

  const signUp=(event)=>{
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{
      return authUser.user.updateProfile({
        displayName:username
      })
    })
    .catch((error)=>alert(error.message));

    setOpen(false);
  }

  const signIn=(event)=>{
    event.preventDefault();

    auth.
    signInWithEmailAndPassword(email,password)
    .catch((error)=>alert(error.message))

    setOpenSignIn(false);
  }

  return (
    <div className="App">

        
       <Modal
          open={open}
          onClose={()=>setOpen(false)}
          
      >
      <div style={modalStyle} className={classes.paper}>
      <form className="app__signup">
      <center>
          <img 
            className="app__headerImage"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt=""
          />
        </center>
        <Input
          placeholder="username"
          type="text"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
        />
        <Input
          placeholder="email"
          type="text"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />
        <Input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />
        <Button type="submit" onClick={signUp}>Sign Up</Button>

      </form>
      </div>
      </Modal>

      <Modal
          open={openSignIn}
          onClose={()=>setOpenSignIn(false)}
          
      >
      <div style={modalStyle} className={classes.paper}>
      <form className="app__signup">
      <center>
          <img 
            className="app__headerImage"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt=""
          />
        </center>
        <Input
          placeholder="email"
          type="text"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />
        <Input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />
        <Button type="submit" onClick={signIn}>Sign In</Button>

      </form>
      </div>
      </Modal>
      
      <div className="app__header">
        <img 
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
        {user?(
        <Button onClick={()=>auth.signOut()}>Log Out</Button>
      ):(
        <div className="app-loginContainer">
          <Button onClick={()=>setOpenSignIn(true)}>Sign In</Button>
          <Button onClick={()=>setOpen(true)}>Sign Up</Button>
        </div>
      )}
      </div>
      
      <div className="app__posts">
        <div className="app__postsLeft">
          {
            posts.map((post)=>(
              <Post
                 key={post._id}  
                 username={post.user}  
                 caption={post.caption} 
                 imageUrl={post.image}/>
            ))
          }
        </div>
      </div>

      

{user?.displayName ?(
          <ImageUpload username={user.displayName} />
        ):(
          <h3>Sorry you need to be logged in to upload</h3>
        )}
      
    </div>
  );
}

export default App;
