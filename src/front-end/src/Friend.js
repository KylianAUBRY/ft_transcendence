import './Friend.css';

function Friend( props ) {
    console.log(props.friend)

    let isOnline
    if (props.friend.isOnline === true)
        isOnline = props.t('home.online')
    else    
        isOnline = props.t('home.offline')
    return (
        <li className='friend'>
            {props.friend.username}   --   {isOnline}
        </li>

    )}


export default Friend