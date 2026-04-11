import { useState, useEffect } from 'react';
import api from '../api';
//npm install sweetalert2
import { Toast } from '../utils/toast';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [timer, setTimer] = useState(0);
    const [currentUser, setCurrentUser] = useState(null);
    //const [ip, setIp] = useState('');

   /*      const getCurrentUser = async () => {
            try {
                const res = await api.get('/users/me');
                console.log('Current User:', res.data);
            } catch (err) {
                console.error(err);
            }
        }; */

    // ✅ Fetch users with timer
    const getUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data.data);
            setTimer(15);
        } catch (err) {
            console.error(err?.response?.data);
            // ✅ IMPORTANT: Ignore auth errors (handled by interceptor)
            if (err?.response?.status !== 401) {
                //alert(err?.response?.data?.message);
                Toast.fire({
                    icon: 'error',
                    title: err?.response?.data?.message || 'Something went wrong',
                });
            }
        }
    };
    /*     useEffect(() => {
            const fetchIp = async () => {
                try {
                    const res = await api.get('/users/ip');
                    //console.log("IP ADDRESS:"+res.data);
                    setIp(res.data.data);
                } catch (err) {
                    console.error(err);
                }
            };
    
            fetchIp();
        }, []); */

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('/users/me');
                console.log("RES::", res.data);

                // ✅ FIX HERE
                setCurrentUser(res.data.data);

            } catch (err) {
                console.error(err);
            }
        };

        fetchUser();
    }, []);

    // ✅ Countdown logic
    useEffect(() => {
        if (timer === 0) return;

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    // ✅ Fetch users without timer
    const getUsersNoTimer = async () => {
        try {
            //http://localhost:3000/users
            const res = await api.get('/users');
            setUsers(res.data.data);
        } catch (err) {
            console.error(err?.response?.data);

            // ✅ IMPORTANT: Ignore auth errors (handled by interceptor)
            if (err?.response?.status !== 401) {
                //alert(err?.response?.data?.message);                
                console.log('=========== GOING TO LOGIN ============');
                console.log(err?.response?.data?.message);
                console.log('=========== GOING TO LOGIN ============');

            }
        }
    };

    return (
        <div
            className="p-4 bg-gray-100 min-h-screen"
            style={{ width: '770px', margin: '0 auto' }}
        >
            <div className="bg-white shadow-lg rounded-2xl p-6 mb-6 border border-gray-100">

                <h2 className="text-xl font-bold text-gray-800 mb-2">
                    👋 Welcome,
                    <span className="text-purple-600 ml-2">
                        {currentUser?.email}
                    </span>
                </h2>

                <p className="text-gray-600">
                    Role:
                    <span className={`
            ml-2 px-3 py-1 rounded-full text-sm font-semibold
            ${currentUser?.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-green-100 text-green-700'}
        `}>
                        {currentUser?.role}
                    </span>
                </p>
                <p className="text-gray-600">
                    Last Activity:
                    <span className="ml-2 font-semibold text-gray-400">
                        {currentUser?.lastActivity &&
                            new Date(currentUser.lastActivity).toLocaleString()}
                    </span>
                </p>
                {/* ✅ NEW: IP DISPLAY */}
                {/* <p className="text-gray-600">
                    IP Address:
                    <span className="ml-2 font-semibold text-blue-600">
                        {ip}
                    </span>
                </p> */}

            </div>
            {/* ACTION BUTTONS */}
            <div className="flex gap-4 mb-6">
                <button
                    className={`px-5 py-2 rounded-lg text-white ${timer > 0 ? 'bg-gray-400' : 'bg-purple-600'
                        }`}
                    onClick={getUsers}
                    disabled={timer > 0}
                >
                    {timer > 0 ? `⏳ Wait ${timer}s` : 'Fetch Users'}
                </button>

                <button
                    className="bg-green-600 text-white px-5 py-2 rounded-lg"
                    onClick={getUsersNoTimer}
                >
                    ⚡ Fetch (No Timer)
                </button>
            </div>

            {/* USERS TABLE */}
            <table className="w-full border-collapse bg-white rounded-2xl shadow-lg overflow-hidden">

                {/* HEADER */}
                <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                    <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wide">ID</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wide">Email</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wide">Role</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wide">Last Activity</th>
                    </tr>
                </thead>

                {/* BODY */}
                <tbody className="text-gray-700 text-sm">
                    {users.length > 0 ? (
                        users.map((user, index) => (
                            <tr
                                key={user.id}
                                className={`
                        border-b transition duration-200
                        ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                        hover:bg-purple-50 hover:scale-[1.01]
                    `}
                            >
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    #{user.id}
                                </td>

                                <td className="px-6 py-4">
                                    {user.email}
                                </td>

                                <td className="px-6 py-4">
                                    <span className={`
                            px-3 py-1 rounded-full text-xs font-semibold
                            ${user.role === 'ADMIN'
                                            ? 'bg-purple-100 text-purple-700'
                                            : 'bg-green-100 text-green-700'}
                        `}>
                                        {user.role}
                                    </span>
                                </td>

                                <td className="px-6 py-4 text-gray-500">
                                    {new Date(user.lastActivity).toLocaleString()}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center py-6 text-gray-400">
                                🚫 No users found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}