const INITIAL_STATE = {
    emailUser: '',
    loggedUSer: 0,
};

function userReducer(state = INITIAL_STATE, action){
    switch(action.type){
        case 'LOG_IN':
            return { ...state, loggedUSer: 1, emailUser: action.emailUser }
        case 'LOG_OUT':
            return { ...state, loggedUSer: 0, emailUser: null }
        default:
            return state;
    }
}

export default userReducer;