import { useState } from 'react';
import api from '../api';
import { Toast } from '../utils/toast';

export default function SendMail() {
    const [form, setForm] = useState({
        to: '',
        subject: '',
        text: '',
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async () => {
        if (!form.to || !form.subject || !form.text) {
            Toast.fire({
                icon: 'warning',
                title: 'All fields are required',
            });
            return;
        }

        setLoading(true);

        try {
            const res = await api.post('/mail/send', form);

            console.log('MAIL SENT:', res.data);

            Toast.fire({
                icon: 'success',
                title: 'Email sent successfully 📧',
            });

            // reset form
            setForm({
                to: '',
                subject: '',
                text: '',
            });

        } catch (err) {
            console.error(err);

            Toast.fire({
                icon: 'error',
                title: err?.response?.data?.message || 'Failed to send email',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">

            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    📧 Send Email
                </h2>

                {/* TO */}
                <input
                    type="email"
                    name="to"
                    placeholder="Recipient Email"
                    value={form.to}
                    onChange={handleChange}
                    className="w-full border p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                />

                {/* SUBJECT */}
                <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full border p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                />

                {/* MESSAGE */}
                <textarea
                    name="text"
                    placeholder="Message"
                    value={form.text}
                    onChange={handleChange}
                    rows="4"
                    className="w-full border p-3 mb-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                />

                {/* BUTTON */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
                >
                    {loading ? 'Sending...' : '🚀 Send Email'}
                </button>

            </div>
        </div>
    );
}