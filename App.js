import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
 apiKey: "AIzaSyAUUoNeWwy4XlQBZG7av-Fx8qjMgqA0jUs",
 authDomain: "the-chat-6713d.firebaseapp.com",
 databaseURL: "https://the-chat-6713d.firebaseio.com",
 projectId: "the-chat-6713d",
 storageBucket: "the-chat-6713d.appspot.com",
 messagingSenderId: "487920432995",
 appId: "1:487920432995:web:e11e7ad2dffb6e6c590556"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>TheChat</h1>
        <SignOut/>
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button onClick={signInWithGoogle}>Sign In</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut}>Sign Out</button>
  )
}

function ChatRoom() {
  const dummy = useRef();

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();
    const {uid, photoURL} = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');

    dummy.current.scrollIntoView({behavior:'smooth'});

  }

  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

        <div ref={dummy}></div>
      </main>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e)=>setFormValue(e.target.value)} />
        <button type="submit" disabled={!formValue}><span>&#9749;</span></button>
      </form>
    </>
  )
}

function ChatMessage(props) {
  const {text,uid} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'recieved';

  return (<>
    <div className={`message ${messageClass}`}>
      <p>{text}</p>
    </div>
  </>)
}

export default App;