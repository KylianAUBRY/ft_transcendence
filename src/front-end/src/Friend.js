import './Friend.css';

function Friend( props ) {
    

    return (
        <li className='friend'>{props.name} 
            <button className='btnMessage' onClick={() => props.setisMessageBox(true)}><img src='./icone-message.png' alt='message' className='iconeMessage'/></button>
        </li>

    )}


export default Friend