import './Friend.css';

function Friend( props ) {


    function handleDelete(){
        console.log('delete', props.friend.user_id)
        fetch(props.baseUrl + ':8000/' + 'api/RemoveFriend', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              "Authorization": "Token " + localStorage.getItem("token")
              },
            body: JSON.stringify({
              userId: localStorage.getItem("userID"),
              friendId: props.friend.user_id
            }),
          }).then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }


            fetch(props.baseUrl + ':8000/' + 'api/GetFriendList', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                "Authorization": "Token " + props.csrfToken
                },
              body: JSON.stringify({
                userId: localStorage.getItem("userID")
              }),
            }).then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            }).then(function(data){
              if (data.friend_list.length !== props.nb){
                props.setFriend(data.friend_list)
                props.setNb(data.friend_list.length)
                console.log(data.friend_list)
              }
                
      
            }).catch(function(err){
              console.error(err)
            });


















            return response.json();
          }).catch(err => {
            console.error(err)
          })
    }


    console.log('friend', props.friend.username)
    let isOnline
    if (props.friend.isOnline === true)
        isOnline = props.t('home.online')
    else    
        isOnline = props.t('home.offline')
    return (
        <li className='friend'>
            {props.friend.username}   --   {isOnline}
            <button onClick={handleDelete}>delete</button>
        </li>

    )}


export default Friend