import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function CreateUser() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const createUser = async () => {
        if (!email || !password) {
            alert('Email and Password are required');
            return;
        }

        setLoading(true);

        try {
            const res = await api.post('/users', {
                email,
                password,
                role: 'USER',
            });

            console.log('USER CREATED:', res.data);
            alert('User Created');

            navigate('/login'); // ✅ redirect

        } catch (err) {
            console.error(err);
            alert(err?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-200">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    ➕ Create User
                </h1>

                <div className="mb-4">
                    <label className="block text-gray-600 mb-1">Email</label>
                    <input
                        className="w-full border border-gray-300 p-3 rounded-lg"
                        placeholder="Enter user email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-600 mb-1">Password</label>
                    <input
                        type="password"
                        className="w-full border border-gray-300 p-3 rounded-lg"
                        placeholder="Enter password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                    onClick={createUser}
                >
                    {loading ? 'Creating...' : '🚀 Create User'}
                </button>

                <p className="text-sm text-gray-500 text-center mt-4">
                    Add new users to your system securely.
                </p>
            </div>
        </div>
    );
}