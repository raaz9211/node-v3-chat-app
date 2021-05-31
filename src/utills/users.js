const users = []

//addUser.removeUser,getUser,getUserInRoom

const addUser = ({id,username,room}) =>{
    //Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Validate data
    if(!room || !username){
        return {
            error : 'Username and room are required!'
        }


    }

    //chck for existing user
    const existinguser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //valatate username

    
    if(existinguser){
        return {
            error: 'Username is in use'
        }
    }

    //Store user 
    const user = {id,username,room}
    users.push(user)
    return {user}

}

const removeUser = (id) => {
    const index = users.findIndex((user)=> user.id === id)

    if(index !== -1)
        return users.splice(index,1)[0]
}

const getUser = (id) =>{
    return user = users.find((user) => user.id === id)
}

const getUserInRoom = (room) =>{
    return users.filter((user) => room === user.room)
}
module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}