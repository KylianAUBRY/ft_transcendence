import './MessageBox.css'
import { useTranslation } from 'react-i18next'

function MessageBox( props ) {
    const [t] = useTranslation("global")

    return (
        <div className='messageBox'>
            <h4 className='friendName'>{t("social.name")}
            <button className='exitMessage' onClick={() => props.setisMessageBox(false)}><img src='./icone-croix.png' alt='exit'/></button>
            
            </h4>
            
            <div className='messages'>
                
            </div>
            <form className='formMessage'> 
                <input placeholder='Message' className='inputMessage'></input>
                <button className='btnSend'>{t("social.send")}</button>
            </form>
        </div>
    )}


export default MessageBox