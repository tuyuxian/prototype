
const initialState = {
    users: {
        username: "",
        email: "",
        password: "",
        birthday: "",
        status_tutor: "",
        status_student: "",
        status_parents: ""
    }
}

export default function rootReducer(state = initialState, action) {
    let users;
    switch (action.type) {
        case "REGISTER":
            users = state.users
            let newUser = action.values
            users[newUser["email"]] = newUser
            return {
                ...state,
                users: users,
            };
        default:
            return state;
    }
}

