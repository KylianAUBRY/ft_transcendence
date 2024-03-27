import './SocialMenu.css'
import Friend from './Friend'
import { useState, useEffect } from 'react'
import MessageBox from './MessageBox'
import { useTranslation } from 'react-i18next'
import useSound from 'use-sound'

let langValue
let musicValue
let colorValue

function SocialMenu( props ) {
    const [play1, { stop: stop1 }] = useSound('music1.mp3', { loop: true, volume: 0.5 })
    const [play2, { stop: stop2 }] = useSound('music2.mp3', { loop: true, volume: 0.5 })
    const [play3, { stop: stop3 }] = useSound('music3.mp3', { loop: true, volume: 0.5 })
    const [t, i18n] = useTranslation("global")
    const [inPlay, setInPlay] = useState(0)
    const [add, setAdd] = useState('')

function displayList(){
    var list = document.getElementById("container")
    var btn = document.getElementById('displayBtn')
    var lineOne = document.getElementById('line1');
    var lineTwo = document.getElementById('line2');
    var lineThree = document.getElementById('line3');
    if(list.classList.contains("active")) {
        btn.classList.remove("active")
        list.classList.remove("active")
        lineOne.classList.remove('line-cross');
        lineTwo.classList.remove('line-fade-out');
        lineThree.classList.remove('line-cross');
        props.setisSocialMenu(false)
    }else{
        btn.classList.toggle("active")
        list.classList.toggle("active")
        lineOne.classList.toggle('line-cross');
        lineTwo.classList.toggle('line-fade-out');
        lineThree.classList.toggle('line-cross');
        props.setisSocialMenu(true)
    }
        
}

function updateOptions(){
    fetch(props.baseURL + ':8080/' + 'api/UpdateUserOption', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'userId': props.userId,
            'language': langValue,
            'color': colorValue,
            'music': musicValue,
            'key1': props.selectedKeys[0],
            'key2': props.selectedKeys[1],
            'key3': props.selectedKeys[2],
            'key4': props.selectedKeys[3]
        }),
      }).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }).catch(function(error){
        console.error(error)
        })
}

function handleAddChange(e){
    e.preventDefault()
    setAdd(e.target.value)
}

function handleAddFriend(e){
    e.preventDefault()
    console.log(add)
    fetch(props.baseUrl + ':8080/' + 'api/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: props.userId,
          friendId: add
        }),
      }).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }).then(function(data){
        console.log(data)
      }).catch(function(err){
        console.error(err)
      });
}



    console.log('test')
    fetch(props.baseUrl + ':8080/' + 'api/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: props.userId
        }),
      }).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }).then(function(data){
        console.log(data)
      }).catch(function(err){
        console.error(err)
      });
        

const handleChangeLang = event => {
    langValue = event.target.value
    i18n.changeLanguage(langValue)
    updateOptions()
  };
  
const handleChangeMusic = event => {
    musicValue = event.target.value
    if (inPlay == 1)
        stop1()
    else if (inPlay == 2)
        stop2()
    else if (inPlay == 3)
        stop3()

    if (musicValue == 1){
        play1()
        setInPlay(1)
    } else if (musicValue == 2){
        play2()
        setInPlay(2)
    }else if (musicValue == 3){
        play3()
        setInPlay(3)
    }
    updateOptions()
  };

  const handleChangeColor = event => {
    colorValue = event.target.value
    if (colorValue === 'white')
        props.setracketColor(0xffffff)
    else if (colorValue === 'dark grey')
        props.setracketColor(0x373737)
    else if (colorValue === 'light blue')
        props.setracketColor(0x7FDAD0)
    else if (colorValue === 'light grey')
        props.setracketColor(0x898989)
    else if (colorValue === 'purple')
        props.setracketColor(0x720F8F)
    updateOptions()
  };

 

  useEffect(() => {
    function handleKeyPress(event) {
      const index = props.selectedKeys.findIndex(key => key === 'listening');
      if (index !== -1) {
        const newSelectedKeys = [...props.selectedKeys];
        newSelectedKeys[index] = event.code;
        props.setSelectedKeys(newSelectedKeys);
      }
    }

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [props.selectedKeys]);

  const handleClickSelectKey = (index) => {
    const newSelectedKeys = [...props.selectedKeys];
    newSelectedKeys[index] = 'listening';
    props.setSelectedKeys(newSelectedKeys);
  };



  const [selectedImage, setSelectedImage] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  function uploadImage(e) {
    e.preventDefault();


      const formData = new FormData();
      formData.append('file', selectedImage);
    

        if (username !== '')
            setUsername(props.username) 


      fetch(props.baseURL + ':8080/' + 'api/UpateUserInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: props.userId,
          username: username,
          password: password,
          image: formData
        }),
      }).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }).catch(function(error){
        console.error(error)
        })
}



const handleImageChange = (e) => {
    const file = e.target.files[0]; // Récupérer le premier fichier sélectionné
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl); // Mettre à jour l'état avec l'URL de l'image
  };


    return (
        <div className='friendList'>
            <button className='displayBtn' id='displayBtn' onClick={displayList}>
                <div className="line line--1" id='line1'></div>
                <div className="line line--2" id='line2'></div>
                <div className="line line--3" id='line3'></div>
            </button>
            <div className='container' id='container'>
            {props.currentUser ? (
            <button className="logoutBtn" onClick={props.handleLogout}>{t("home.logout")}</button>  
            ) : null}
                <h3 className='title'>{t("social.list")}</h3>
                <div className='myId'>{t("home.id")}{props.userId}</div>
                <form className='formFriend' onSubmit={handleAddFriend}>
                    <input placeholder={t("social.add")} className='inputFriend' onChange={handleAddChange}></input>
                    <button className='btnFriend' type='submit'>+</button>
                </form>
                <ul className='list'>
                    <Friend name={"Friend 1"}/>
                    <Friend name={"Friend 2"}/>
                    <Friend name={"Friend 3"}/>
                    <Friend name={"Friend 4"}/>
                    <Friend name={"Friend 5"}/>
                    <Friend name={"Friend 6"}/>
                    <Friend name={"Friend 7"}/>
                </ul>
                <div className='customize'>
                <p>{t("social.customize")}</p>
                <div>
                <div className='options'>
                <div>
                    {t("social.language")}
                    <select name="lang" id="lang-select" onChange={handleChangeLang} className='lang'>
                        <option value="en">{t("social.english")}</option>
                        <option value="fr">{t("social.french")}</option>
                        <option value="es">{t("social.spanish")}</option>
                    </select>
                </div>
                <div>
                    {t("social.music")}
                    <select name="music" id="music-select" onChange={handleChangeMusic}>
                        <option value="">{t("social.noMusic")}</option>
                        <option value="1">{t("social.music1")}</option>
                        <option value="2">{t("social.music2")}</option>
                        <option value="3">{t("social.music3")}</option>
                    </select>
                </div>
                <div>
                    {t("social.colorR")}
                    <select name="color" id="color-select" onChange={handleChangeColor}>
                        <option value="white">{t("social.white")}</option>
                        <option value="light blue">{t("social.blue")}</option>
                        <option value="light grey">{t("social.grey1")}</option>
                        <option value="dark grey">{t("social.grey2")}</option>
                        <option value="purple">{t("social.purple")}</option>
                    </select>
                </div>
                </div>
                <div>
                <div>
                    <div className='labelKey'>
                        <label>
                            {t("social.key1")} {props.selectedKeys[0] || 'KeyA'}
                            <br />
                            <button onClick={() => handleClickSelectKey(0)}>{t("social.select")}</button>
                        </label>
                    </div>
                    <br />
                    <div className='labelKey'>
                        <label>
                            {t("social.key2")} {props.selectedKeys[1] || 'KeyD'}
                            <br />
                            <button onClick={() => handleClickSelectKey(1)}>{t("social.select")}</button>
                        </label>
                    </div>
                    <br />
                    <div className='labelKey'>
                        <label>
                            {t("social.key3")} {props.selectedKeys[2] || 'ArrowLeft'}
                            <br />
                            <button onClick={() => handleClickSelectKey(2)}>{t("social.select")}</button>
                        </label>
                    </div>
                    <br />
                    <div className='labelKey'>
                        <label>
                            {t("social.key4")} {props.selectedKeys[3] || 'ArrowRight'}
                            <br />
                            <button onClick={() => handleClickSelectKey(3)}>{t("social.select")}</button>
                        </label>
                    </div>
                </div>
                </div>
            </div>
            </div>




            <div className='ChangeInfo'>
                <p>Change Info</p>
                <form onSubmit={uploadImage}>
                    <input placeholder='Image' type='file' accept="image/*" onChange={handleImageChange}></input>
                    <input placeholder='Username'type='text' onChange={e => setUsername(e.target.value)}></input>
                    <input placeholder='Password' type='password' onChange={e => setPassword(e.target.value)}></input>
                    <button type='submit' >{t("home.change")}</button>
                </form>
            </div>
           

            </div>
        </div>
    )}


export default SocialMenu
