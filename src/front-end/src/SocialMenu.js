import './SocialMenu.css'
import Friend from './Friend'
import { useState, useEffect } from 'react'
import useSound from 'use-sound'

let langValue
let musicValue
let colorValue

function SocialMenu( props ) {
    const [play1, { stop: stop1 }] = useSound('music1.mp3', { loop: true, volume: 0.5 })
    const [play2, { stop: stop2 }] = useSound('music2.mp3', { loop: true, volume: 0.5 })
    const [play3, { stop: stop3 }] = useSound('music3.mp3', { loop: true, volume: 0.5 })
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
  var lng = 'fr'
  console.log('icii')
  if (langValue === 'fr'){
    lng = 'French'
  } else if (langValue == 'es'){
    lng = 'Spanish'
  }else if (langValue === 'en'){
    lng = 'English'
  }
    fetch(props.baseURL + ':8000/' + 'api/UpdateUserOption', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFTOKEN': props.csrfToken,
        },
        body: JSON.stringify({
            'userId': props.userId,
            'language': lng,
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
    fetch(props.baseUrl + ':8000/' + 'api/AddFriend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFTOKEN': props.csrfToken,
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



props.client
  .post("/api/GetFriendList", {  
    userId: props.userId
  })
  .then(function(response){
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(function(data){
    console.log(data);
  })
  .catch(function(err){
    console.error(err);
  });


        

const handleChangeLang = event => {
    langValue = event.target.value
    props.i18n.changeLanguage(langValue)
    //updateOptions()
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
    //updateOptions()
  };

  const handleChangeColor = event => {
    console.log('test1')
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
    //updateOptions()
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


      fetch(props.baseURL + ':8000/' + 'api/UpateUserInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFTOKEN': props.csrfToken,
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
            <button className="logoutBtn" onClick={props.handleLogout}>{props.t("home.logout")}</button>  
            ) : null}
                <h3 className='title'>{props.t("social.list")}</h3>
                <div className='myId'>{props.t("home.id")}{props.userId}</div>
                <form className='formFriend' onSubmit={handleAddFriend}>
                    <input placeholder={props.t("social.add")} className='inputFriend' onChange={handleAddChange}></input>
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
                <p>{props.t("social.customize")}</p>
                <div>
                <div className='options'>
                <div>
                    {props.t("social.language")}
                    <select name="lang" id="lang-select" onChange={handleChangeLang} className='lang'>
                        <option value="en">{props.t("social.english")}</option>
                        <option value="fr">{props.t("social.french")}</option>
                        <option value="es">{props.t("social.spanish")}</option>
                    </select>
                </div>
                <div>
                    {props.t("social.music")}
                    <select name="music" id="music-select" onChange={handleChangeMusic}>
                        <option value="">{props.t("social.noMusic")}</option>
                        <option value="1">{props.t("social.music1")}</option>
                        <option value="2">{props.t("social.music2")}</option>
                        <option value="3">{props.t("social.music3")}</option>
                    </select>
                </div>
                <div>
                    {props.t("social.colorR")}
                    <select name="color" id="color-select" onChange={handleChangeColor}>
                        <option value="white">{props.t("social.white")}</option>
                        <option value="light blue">{props.t("social.blue")}</option>
                        <option value="light grey">{props.t("social.grey1")}</option>
                        <option value="dark grey">{props.t("social.grey2")}</option>
                        <option value="purple">{props.t("social.purple")}</option>
                    </select>
                </div>
                </div>
                <div>
                <div>
                    <div className='labelKey'>
                        <label>
                            {props.t("social.key1")} {props.selectedKeys[0] || 'KeyA'}
                            <br />
                            <button onClick={() => handleClickSelectKey(0)}>{props.t("social.select")}</button>
                        </label>
                    </div>
                    <br />
                    <div className='labelKey'>
                        <label>
                            {props.t("social.key2")} {props.selectedKeys[1] || 'KeyD'}
                            <br />
                            <button onClick={() => handleClickSelectKey(1)}>{props.t("social.select")}</button>
                        </label>
                    </div>
                    <br />
                    <div className='labelKey'>
                        <label>
                            {props.t("social.key3")} {props.selectedKeys[2] || 'ArrowLeft'}
                            <br />
                            <button onClick={() => handleClickSelectKey(2)}>{props.t("social.select")}</button>
                        </label>
                    </div>
                    <br />
                    <div className='labelKey'>
                        <label>
                            {props.t("social.key4")} {props.selectedKeys[3] || 'ArrowRight'}
                            <br />
                            <button onClick={() => handleClickSelectKey(3)}>{props.t("social.select")}</button>
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
                    <button type='submit' >{props.t("home.change")}</button>
                </form>
            </div>
           

            </div>
        </div>
    )}


export default SocialMenu
