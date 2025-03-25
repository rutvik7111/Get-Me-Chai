"use client"
import { createContext, useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { toast } from "react-toastify";

export const Context = createContext(null);

export default function ContextProvider({ children }) {
    const { data: session, status } = useSession();
    const [user, setUser] = useState(null)
    const [users, setUsers] = useState([])
    const [userSecret, setUserSecret] = useState(null)
    const [posts, setPosts] = useState(null)
    const [isUserProfile, setIsUserProfile] = useState(null)
    const [userSubs, setUserSubs] = useState(null)

    useEffect(() => {
        if (status === "authenticated" && session) {
            setUserSubs(session.user.subscriptions);
        }
    }, [status, session])

    useEffect(() => {
        (async function () {
            if (userSubs) {
                await fetch("/api/user/" + session.user.id, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ subscriptions: userSubs }),
                });
            }
        })();
    }, [userSubs])

    const handleSubscription = (event, userId, username) => {
        event.stopPropagation(); // Stops event from reaching parent
        if (!session) {
            signIn()
            return;
        }
        setUserSubs([...userSubs, userId]);
        toast(`Subscribed to ${username}`)
    }

    useEffect(() => {
        (async function () {
            const res = await fetch("/api/users")
            const data = await res.json()
            setUsers(data)
        })();
    }, [])

    return (
        <Context.Provider value={{ user, setUser, posts, setPosts, isUserProfile, setIsUserProfile, userSubs, setUserSubs, users, setUsers, handleSubscription, userSecret, setUserSecret }}>
            {children}
        </Context.Provider>
    );
}
