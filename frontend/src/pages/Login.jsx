import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { loginapi } from "../utils/api"
import { toast } from "react-toastify";
import { useUser } from "../context/useUser";

const Login = () => {
    const navigate = useNavigate();
    
    const [userInfo, setUserInfo] = useState({
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const [error] = useState('');
    const {setUser} = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userInfo.email) {
            toast.warn("Please enter your email");
            return;
        }
        if (!userInfo.password) {
            toast.warn("Please enter your password");
            return;
        }

        try {
            setLoading(true);
            const response = await loginapi(userInfo);

            if (response?.user) {
                setUser(response?.user)
                // Save user session
                localStorage.setItem('user', JSON.stringify(response.user));

                // 2. Trigger Success Toast
                toast.success(`Welcome back, ${response.user.name}!`);

                // Redirect based on user role[cite: 1]
                if (response.user.role === 'Admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/');
                }
            }
        } catch (err) {
            // 3. Trigger Error Toast
            const errorMessage = err?.response?.data?.message || 'Invalid email or password';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="bg-gray-50 px-4 md:px-8 dark:bg-neutral-900">
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="max-w-md w-full">
                    <a href="/">
                        <img src="https://readymadeui.com/logo-alt.svg" alt="logo" className="w-14 min-h-14 mb-8 mx-auto block" />
                    </a>
                    <div className="p-6 rounded-lg bg-white border border-slate-300 shadow-xs md:p-8 dark:bg-neutral-800 dark:border-neutral-700">
                        <h1 className="text-slate-900 text-center text-3xl font-bold dark:text-slate-50">Sign in</h1>

                        {/* Inline Error Message */}
                        {error && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md text-center dark:bg-red-950/40 dark:border-red-800 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                            <div>
                                <label htmlFor="email" className="mb-2 text-slate-900 font-medium text-sm inline-block dark:text-slate-50">Email</label>
                                <input 
                                    value={userInfo.email} 
                                    onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))} 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    placeholder="john@readymadeui.com" 
                                    disabled={loading}
                                    required 
                                    className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:text-slate-50 dark:bg-neutral-700 dark:outline-neutral-600 disabled:opacity-50" 
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="mb-2 text-slate-900 font-medium text-sm inline-block dark:text-slate-50">Password</label>
                                <input 
                                    value={userInfo.password} 
                                    onChange={(e) => setUserInfo(prev => ({ ...prev, password: e.target.value }))}  
                                    type="password" 
                                    id="password" 
                                    name="password" 
                                    placeholder="••••••••" 
                                    disabled={loading}
                                    required 
                                    className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:text-slate-50 dark:bg-neutral-700 dark:outline-neutral-600 disabled:opacity-50" 
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full py-2 px-3.5 text-sm rounded-md font-semibold cursor-pointer tracking-wide text-white border border-blue-600 bg-blue-600 hover:bg-blue-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </button>
                            
                            <div className="text-slate-900 text-sm text-center dark:text-slate-50">
                                Don't have an account? 
                                <Link to="/signup" className="text-blue-700 hover:underline ml-1 font-medium dark:text-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded">
                                    Sign up
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Login;