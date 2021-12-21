import Head from 'next/head';
import styled from 'styled-components';
import Sidebar from '../../components/sidebar';
import ChatScreen from '../../components/chatScreen';
import { Collections } from '@material-ui/icons';
import {db, auth} from '../../firebase';
import getReceipientEmail from '../../lib/getRecipientEmail';
import { useAuthState } from 'react-firebase-hooks/auth';

const Container = styled.div`
    display: flex;
`;
const ChatContainer = styled.div`
    flex: 1;
    overflow: scroll;
    height: 100vh;
    ::-webkit-scrollbar{
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-wdth: none;
`;



function Chat({chat, messages}) {
    const [user] = useAuthState(auth);
    return (
        <Container>
            <Head>
                <title>
                   Chat with {getReceipientEmail(chat.users, user)} 
                </title>
            </Head>
            <Sidebar/>
            <ChatContainer>
                <ChatScreen chat={chat} messages={messages}/>
            </ChatContainer>
        </Container>
    )
}

export default Chat;


export async function getServerSideProps(context){
    const ref = db.collection('chats').doc(context.query.id);    
    const messageRes = await ref.collection('message').orderBy('timestamp', 'asc').get();    
    const messages = messageRes.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })).map(messages => ({
        ...messages,
        timestamp: messages.timestamp.toDate().getTime()
    }));
    const chatRes = await ref.get();
    const chat = {
        id: chatRes.id,
        ...chatRes.data()
    };
    return {
        props: {
            messages: JSON.stringify(messages),
            chat: chat
        }
    };
}