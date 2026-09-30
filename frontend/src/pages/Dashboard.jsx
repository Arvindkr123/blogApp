import {
    BarChart2,
    Bell,
    DollarSign,
    Home,
    LogOut,
    Menu,
    Search,
    Settings,
    ShoppingBag,
    TrendingUp,
    Users,
    X
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Retrieve logged-in user from localStorage or fallback
  const user = JSON.parse(localStorage.getItem('user')) || {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin'
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast.info('Logged out successfully');
    navigate('/login');
  };

  const stats = [
    { title: 'Total Revenue', value: '$45,231.89', change: '+20.1%', icon: DollarSign, color: 'bg-blue-500' },
    { title: 'Active Users', value: '+2,350', change: '+180.1%', icon: Users, color: 'bg-emerald-500' },
    { title: 'Sales', value: '+12,234', change: '+19%', icon: ShoppingBag, color: 'bg-purple-500' },
    { title: 'Performance', value: '+573', change: '+201', icon: TrendingUp, color: 'bg-amber-500' },
  ];

  const recentTransactions = [
    { id: 'TX-1001', user: 'Olivia Martin', email: 'olivia@email.com', amount: '+$1,999.00', status: 'Completed', date: '2026-09-28' },
    { id: 'TX-1002', user: 'Jackson Lee', email: 'jackson@email.com', amount: '+$39.00', status: 'Completed', date: '2026-09-27' },
    { id: 'TX-1003', user: 'Isabella Nguyen', email: 'isabella@email.com', amount: '+$299.00', status: 'Pending', date: '2026-09-26' },
    { id: 'TX-1004', user: 'William Kim', email: 'will@email.com', amount: '+$99.00', status: 'Completed', date: '2026-09-25' },
    { id: 'TX-1005', user: 'Sofia Davis', email: 'sofia@email.com', amount: '+$39.00', status: 'Failed', date: '2026-09-24' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 flex flex-col md:flex-row">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-neutral-800 border-r border-slate-200 dark:border-neutral-700 flex flex-col justify-between transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out`}>
        <div>
          {/* Logo Section */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-neutral-700">
            <div className="flex items-center space-x-3">
              <img src="https://readymadeui.com/logo-alt.svg" alt="logo" className="w-8 h-8" />
              <span className="text-lg font-bold text-slate-900 dark:text-slate-50">Dashboard</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-500 dark:text-slate-400">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1">
            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <Home className="w-5 h-5" />
              <span>Overview</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-neutral-700 transition-colors">
              <BarChart2 className="w-5 h-5" />
              <span>Analytics</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-neutral-700 transition-colors">
              <Users className="w-5 h-5" />
              <span>Customers</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-neutral-700 transition-colors">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </a>
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-200 dark:border-neutral-700">
          <div className="flex items-center justify-between mb-4 px-2">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {user.role}
            </span>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white dark:bg-neutral-800 border-b border-slate-200 dark:border-neutral-700 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-neutral-700 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative w-48 md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-neutral-700 text-slate-900 dark:text-slate-100 border-none focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-neutral-700 rounded-full">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Welcome back, {user.name}!</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Here is what is happening with your projects today.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="p-5 bg-white dark:bg-neutral-800 rounded-xl border border-slate-200 dark:border-neutral-700 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-1">{stat.value}</h3>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">{stat.change} from last month</p>
                  </div>
                  <div className={`p-3 rounded-lg text-white ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Activity Table */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl border border-slate-200 dark:border-neutral-700 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-neutral-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">Recent Transactions</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-neutral-700/50 text-slate-700 dark:text-slate-200 font-semibold uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3">Transaction ID</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-neutral-700">
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-neutral-700/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{tx.id}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100">{tx.user}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{tx.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{tx.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          tx.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                          tx.status === 'Pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                          'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;