const socket = io()

//Elements 
const $messageFrom = document.querySelector('#message-form')
const $messageFromInput = $messageFrom.querySelector('input')
const $messageFromButton = $messageFrom.querySelector('button')
const $sendLocationButton = document.querySelector("#send-location")
const $messages = document.querySelector("#messages")
const $location = document.querySelector("#location")

//templete
const messageTemplate = document.querySelector("#message-template").innerHTML
const locationTemplate = document.querySelector("#location-message-template").innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Option
const {username , room} = Qs.parse(location.search,{ignoreQueryPrefix : true})


const autoscroll = () =>{
    //new message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //visible height
    const visibleHeight = $messages.offsetHeight
    //height of message container
    const containerHeight = $messages.scrollHeight

    //how far have i scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset+5){
        $messages.scrollTop = $messages.scrollHeight
    }



 }




socket.on('message',(message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        username : message.username,
        message:message.text,
        createdAt : moment(message.createdAt).format('h:m a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})


socket.on('locationMessage',(message) =>{
    console.log(message)
    const html = Mustache.render(locationTemplate,{
        username:message.username,
        url : message.url,
        createdAt : moment(message.createdAt).format('h:m a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('roomData',({room,users})=>{
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
    
})

$messageFrom.addEventListener('submit',(e)=>{
    e.preventDefault()
    $messageFromButton.setAttribute('disabled','disabled')
    //disable 
    const message = e.target.elements.message.value
    socket.emit('sendMessage',message,(error) => {
        //enable
        $messageFromButton.removeAttribute('disabled','disabled')
        $messageFromInput.value = ""
        $messageFromInput.focus()

        if (error) {
            return console.log(error)
        }

        console.log('Message delivered!')
    })

})

$sendLocationButton.addEventListener('click',()=>{
    if(!navigator.geolocation)
        return alert('Geolocation is nnit supported by your browser')

    $sendLocationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{

        socket.emit('sendLocation',{
        latitude : position.coords.latitude ,
        longitude : position.coords.longitude}, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared!')  
        })
    })
})

socket.emit('join',{username , room},(error)=>{
 
    if(error){
        alert(error)
        location.href = '/'
    }
})