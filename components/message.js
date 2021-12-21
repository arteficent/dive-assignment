import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import moment from 'moment';
const Container = styled.div``;
const MessageElement = styled.p`
    width: fit-content;
    padding: 15px;
    border-radius: 8px;
    margin: 10px;
    min-width: 60px;
    padding-bottom: 26px;
    pasoition: relative;
    text-align: right;
`;

const Sender = styled(MessageElement)`
    margin-left: auto;
    background-color: #dcf8c6;
`;

const Reciever = styled(MessageElement)`
    background-color: whitesmoke;
    text-align : left;
`;

const Timestamp = styled.p` 
    color: gray;
    padding: 10px;
    font-size: 20px;
    position: absolute;
    bottom: 0;
    text-align: right;
    right: 0;
`;

function Message({ user, message }) {
    const [userLoggedIn] = useAuthState(auth);
    const TypeOfMessage = user === userLoggedIn.email ? Sender : Reciever; 
    return (
        <Container>
            <TypeOfMessage>
                {message.message} {' '}
                {message.timestamp ? moment(message.timestamp).format('LT') : '...'}
                {' '}
                {message.seenAt != null ? ('seen') : ( message.deliverAt != null ? ('delivered') : ('sent'))}
            </TypeOfMessage>
        </Container>
    )
}

export default Message