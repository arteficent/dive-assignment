import styled from 'styled-components';
import { Avatar } from '@material-ui/core';
import getReceipientEmail from '../lib/getRecipientEmail';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Receipt } from '@material-ui/icons';
import  { useRouter, userRouter } from 'next/router';
import firebase from '../firebase';
const Container = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 15px;
    word-break;
    :hover{
        background-color: #e9eaeb;
    }
`;  
const UserAvatar = styled(Avatar)`
    margin: 5px;
    margin-right: 15px;
`;
function Chat({id, users}) {
    const [user] = useAuthState(auth);
    const [recipientSnapshot] = useCollection(db.collection('users').where('email', '==', getReceipientEmail(users, user)));
    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getReceipientEmail(users, user);
    const router = useRouter();
    
    function local (messageVar)
    {
        if(messageVar.data().user && messageVar.data().user != user?.email)
        {
        const va = messageVar.data().deliverAt;
        messageVar.ref.update(
            {
                deliverAt: va == null ? Date.now() : va
            }
        )
        }
        return null;
    }
    
    async function updateDel()
    {
        const ref = db.collection('chats').doc(id); 
        const messageRes = await ref.collection('message').get()
        messageRes.docs.map(local);
    }
    updateDel();
    
    const enterChat = () => {
        router.push(`/chat/${id}`);
    }
       
    return (
        <Container onClick={enterChat}>
            {
                recipient? (
                    <UserAvatar src={recipient?.photoURL}/>
                )
                :
                (
                    <UserAvatar>{recipientEmail[0]}</UserAvatar>
                )
                
            }   
            <p>{recipientEmail}</p>
        </Container>
    )
}

export default Chat
