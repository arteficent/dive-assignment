import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components"
import { useRouter } from "next/router";
import { auth, db } from "../firebase";
import { Avatar, IconButton } from "@material-ui/core";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachFileIcon from '@material-ui/icons/AttachFile'
import Message from '../components/message';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon'
import firebase from "firebase";
import { useRef, useState } from "react";
import getRecipientEmail from '../lib/getRecipientEmail';
import TimeAgo from 'timeago-react';




const Container = styled.div`
    
`;

const Header = styled.div`
    position: sticky;
    background-color: white;
    z-index: 100;
    top: 0;
    display: flex;
    padding: 11px;
    height: 80px;
    align-items: center;
    border-bottom: 1px solid whitesmoke;
`;
const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;
    > h3 {
        margin-bottom: 3px;
    }
    > p {
        font-size: 14px;
        color: gray;
    }
`;
const HeaderIcons = styled.div``;
const MessageContainer = styled.div`
    padding: 30px;
    background-color: #e5ded8;
    min-height: 90vh;
`;

const EndOfMessage = styled.div`
    margin-bottom: 50px;
`;
const Input = styled.input`
    flex: 1;
    outline: 0;
    border: none;
    border-radius: 10px;
    background-color: whitesmoke;
    padding: 20px;
    margin-left: 15px;
    margin-right: 15px;    
`; 
const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: white;
    z-index: 100
`;

function ChatScreen({chat, messages}) {
    const [user] = useAuthState(auth);
    const [input, setInput] = useState('');
    const router = useRouter();
    const endOfMessageRef = useRef(null);
    const [ messagesSnapshot ] = useCollection(db.collection('chats').doc(router.query.id).collection('message').orderBy('timestamp', 'asc'));
    const [receipientSnapshot] = useCollection(
        db.collection('users').where('email', '==', getRecipientEmail(chat.users, user))
    );
    
    const ScrollToBottom = () => {
        endOfMessageRef.current.scrollIntoView({
            behaviour: 'smooth',
            block: 'start'
        })
    }
    
    function local (messageVar)
    {
        if(messageVar.data().user && messageVar.data().user != user?.email)
        {
        const va = messageVar.data().deliverAt;
        messageVar.ref.update(
            {
                seenAt: va == null ? Date.now() : va
            }
        )
        }
        return null;
    }
    
    async function updateSeen()
    {
        const ref = db.collection('chats').doc(router.query.id); 
        const messageRes = await ref.collection('message').get()
        messageRes.docs.map(local);
    }
    
    updateSeen();
    
    const showMessages = () => {
        if(messagesSnapshot)
        {
            return messagesSnapshot.docs.map(message => (
              <Message  
              key={message.id} user={message.data().user}
              message = {
                    {
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime()
                    }
                }
              />  
            ))
        }
        else
        {
            return JSON.parse(messages).map((message) => (
                <Message key={message.id} user={message.user} message={message}/>
                   
            ));
        }          
    }
    
    const sendMessages = (e) => {
        e.preventDefault();
        db.collection('users').doc(user.uid).set(
            {
                lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
            },
            {
                merge: true
            }
        ); 
        db.collection('chats').doc(router.query.id).collection('message').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL,
            deliverAt: null,
            seenAt: null
        });
        setInput('');
        ScrollToBottom();
    }
    
    const recipient = receipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(chat.users, user);
    
    return (
        <Container>
            <Header>
                {
                    recipient ? (
                    <Avatar src={recipient?.photoURL}/>)
                    : (
                        <Avatar>{recipientEmail[0]}</Avatar>
                    )
                }
                <HeaderInformation>
                    <h3>{recipientEmail}</h3>
                    {
                        receipientSnapshot ? (
                            <p>Last active: {' '}{recipient?.lastSeen?.toDate() ? (<TimeAgo datetime={recipient?.lastSeen?.toDate()}/> ): ("unavailable")}</p>
                            )
                        :(<p>Loading....</p>)
                    }
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton>
                        <AttachFileIcon/>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon/>
                    </IconButton>
                </HeaderIcons>
            </Header>
            <MessageContainer>
                {showMessages()} 
                <EndOfMessage ref={endOfMessageRef}/>
            </MessageContainer>
            
            <InputContainer>
                <InsertEmoticonIcon/>
                <Input value={input} onChange={e => setInput(e.target.value)}/>
                <button hidden disabled={!input} type='submit' onClick={sendMessages}>
                    send
                </button>
            </InputContainer>
        </Container>
    )
}

export default ChatScreen;
