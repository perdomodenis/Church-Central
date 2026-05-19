import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, onAuthStateChanged } from '../services/firebase';

//Kreiert den Kontext
const AuthContext = createContext();

//Hier provider Komponente
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    //Wenn App startet, überprüft ob User eingeloggt ist
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        //Reinigungs funktion, um Listener zu entfernen
        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

//Hook der genutzt ird für Auth data in Komponenten
export function useAuth() {
    return useContext(AuthContext);
}