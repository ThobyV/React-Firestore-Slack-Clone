import React, { createContext, useReducer, useContext, useEffect, useState } from "react";
import auth from './firebase/auth';

const AuthContext = createContext();

const initialState = {
}

// const reducer = (state, action) => {

//     switch (action.type) {
//         case "":
//             return {
//                 ...state,
//             };
//         default:
//             throw new Error();
//     }
// };

const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateObserver(setAuthUser);
        if (authUser){
            console.log(authUser.uid);
        }
        return () => unsubscribe();
    }, [authUser])

    return (
        <AuthContext.Provider value={[authUser, loading, setLoading]}>
            {children}
        </AuthContext.Provider>
    );
}

const useAuthState = () => useContext(AuthContext);

export {
    AuthProvider,
    useAuthState,
}