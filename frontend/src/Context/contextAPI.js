

// // Create a Context object
// export const UserContext = createContext()

// // Create a Provider component
// export const UserProvider = (props) => {


//     return (
//         <UserContext.Provider value={[user, setUser]}>
//             {props.children}
//         </UserContext.Provider>
//     )
// }


import UserContext from "./state"

const Context = (prop) => {
    const state = {
        username: 'Ali',
        id: '',
        photoCount: 0,
        friendsCount: 0
    }
    return (
        <UserContext.Provider value={state}>
            {prop.children}
        </UserContext.Provider>
    )
}

export default Context