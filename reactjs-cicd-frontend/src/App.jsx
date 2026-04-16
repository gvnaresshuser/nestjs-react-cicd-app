import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import CreateUser from './pages/CreateUser';
import Users from './pages/Users';
import SendMail from './pages/SendMail';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 p-5">
        <h1 className="text-2xl font-bold mb-5 text-center">
          🔐 CI/CD - React JS-Nest JS App-16-04-2026
        </h1>

        {/* Navigation */}
        <div className="flex gap-4 justify-center mb-6">
          <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded">
            Login
          </Link>

          <Link to="/create" className="bg-green-500 text-white px-4 py-2 rounded">
            Create User
          </Link>

          <Link to="/users" className="bg-purple-500 text-white px-4 py-2 rounded">
            Get Users
          </Link>

          <Link to="/send-mail" className="bg-pink-500 text-white px-4 py-2 rounded">
            Send Mail
          </Link>
        </div>

        {/* Routes */}
        <div className="bg-white p-5 rounded shadow" style={{ width: '800px', margin: '0 auto' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/create" element={<CreateUser />} />
            <Route path="/users" element={<Users />} />
            <Route path="/send-mail" element={<SendMail />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;