const users = [];

function userJoin(id,username, room){
    const user = {id, username, room};

    users.push(user);

    return user;
}

//retrievs current user 
function getCurrentUser(id){
    return users.find(user => user.id == id);
}

//user leaves chat
function memberDisconnects(id){
    const index= users.findIndex(user => user.id == id);
    if(index !== -1){
        return users.splice(index,1)[0];
    }

}

//Gets all uers currently in room
function getChannelMembers(room){
    return users.filter(user =>user.room == room);
}
module.exports = {
    userJoin,
    getCurrentUser,
    memberDisconnects,
    getChannelMembers


};