import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Toast } from '../utils/toast';

export default function Login() {
    const [email, setEmail] = useState('admin@test.com');
    const [password, setPassword] = useState('123456');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            //alert('Email and Password are required');
            Toast.fire({
                icon: 'warning',
                title: 'Email and Password are required',
            });
            return;
        }

        setLoading(true);

        try {
            //http://localhost:3000/auth/login
            const res = await api.post('/auth/login', {
                email,
                password,
                role: 'ADMIN',
            });

            console.log('LOGIN SUCCESS:', res.data);

            //alert('Login Successful');
            Toast.fire({
                icon: 'success',
                title: 'Login successful',
            });

            navigate('/users');

        } catch (err) {
            console.error(err);            
            //alert(err?.response?.data?.message || 'Login Failed');            
            Toast.fire({
                icon: 'error',
                title: err?.response?.data?.message || 'Login Failed',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    🔐 Login
                </h1>

                <input
                    className="w-full border p-3 mb-4 rounded-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    className="w-full border p-3 mb-6 rounded-lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg"
                    onClick={handleLogin}
                >
                    {loading ? 'Logging in...' : '🚀 Login'}
                </button>
            </div>
        </div>
    );
}