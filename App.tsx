import React, { useState, useEffect } from 'react';
import { ViewState, User, Property, LeaderboardEntry } from './types';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Leaderboard } from './components/Leaderboard';
import { AffiliationsPanel } from './components/AffiliationsPanel';
import { CommunityPanel } from './components/CommunityPanel';
import { AdminPanel } from './components/AdminPanel';
import { MOCK_FACTION, MOCK_TICKETS, MOCK_SERVER_LOGS, MOCK_ALL_PLAYERS } from './services/mockData';
import { auth, assets, leaderboard } from './services/api';
import { Menu } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<ViewState>(ViewState.LOGIN);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  // Check auth on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await auth.me();
        if (data.user) {
          setUser(mapApiUserToUiUser(data.user));
          setView(ViewState.DASHBOARD);

          try {
            const assetsData = await assets.list();
            setProperties(Array.isArray(assetsData.properties) ? assetsData.properties : []);
          } catch (e) {
            console.error('Failed to load assets', e);
            setProperties([]);
          }
        }
      } catch (error) {
        // Not logged in, stay on login screen
        console.log('Not logged in');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Fetch leaderboard when view changes
  useEffect(() => {
    if (view === ViewState.LEADERBOARD) {
        setLoadingLeaderboard(true);
        const fetchLeaderboard = async () => {
            try {
                const data = await leaderboard.get();
                if (data.leaderboard && Array.isArray(data.leaderboard)) {
                    setLeaderboardData(data.leaderboard);
                } else {
                    console.warn("Leaderboard API returned unexpected structure", data);
                }
            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
            } finally {
                setLoadingLeaderboard(false);
            }
        };
        fetchLeaderboard();
    }
  }, [view]);

  const handleLogin = async (apiUser: any) => {
    setUser(mapApiUserToUiUser(apiUser));
    setView(ViewState.DASHBOARD);

    try {
      const assetsData = await assets.list();
      setProperties(Array.isArray(assetsData.properties) ? assetsData.properties : []);
    } catch (e) {
      console.error('Failed to load assets', e);
      setProperties([]);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.logout();
    } catch (e) {
      console.error('Logout failed', e);
    }
    setUser(null);
    setProperties([]);
    setView(ViewState.LOGIN);
    setSidebarOpen(false);
  };

  const mapApiUserToUiUser = (apiUser: any): User => ({
    id: apiUser.ID,
    username: apiUser.Name,
    level: apiUser.Level,
    cash: apiUser.Money,
    bank: apiUser.Bank,
    hoursPlayed: apiUser.ConnectedTime,
    vipLevel: apiUser.DonateRank,
    adminLevel: apiUser.AdminLevel,
    organization: apiUser.Leader > 0 ? `Leader ${apiUser.Leader}` : (apiUser.Member > 0 ? `Member ${apiUser.Member}` : 'Civilian'),
    avatarUrl: apiUser.avatar_image_url || 'https://i.pravatar.cc/150?img=11',
    joinedDate: apiUser.Registered ? new Date(apiUser.Registered).toLocaleDateString() : 'Unknown',
    warnings: apiUser.Warnings,
    status: apiUser.PermBand ? 'Banned' : (apiUser.Jailed ? 'Jailed' : 'Active'),
    character: apiUser.character,
    affiliations: apiUser.affiliations || []
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f13] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Background Element
  const Background = () => (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Dark Base */}
      <div className="absolute inset-0 bg-[#0f0f13]"></div>
      
      {/* Ambient Gradient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-emerald-600/10 rounded-full blur-[100px] mix-blend-screen"></div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      ></div>
    </div>
  );

  if (view === ViewState.LOGIN) {
    return (
      <>
        <Background />
        <div className="relative z-10">
          <Login onLogin={handleLogin} />
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen text-white font-sans selection:bg-blue-500/30">
      <Background />
      
      <div className="relative z-10 flex h-screen overflow-hidden">
        <Sidebar 
          currentView={view} 
          setView={setView} 
          onLogout={handleLogout} 
          isOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <main className="flex-1 overflow-y-auto w-full lg:ml-64 relative">
          {/* Mobile Header */}
          <div className="lg:hidden sticky top-0 z-30 p-4 flex items-center justify-between bg-[#0f0f13]/80 backdrop-blur-xl border-b border-white/5">
            <span className="font-display font-bold text-xl">SARP UCP</span>
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
            >
              <Menu size={20} />
            </button>
          </div>

          <div className="p-4 lg:p-10 max-w-7xl mx-auto pb-20">
            {view === ViewState.DASHBOARD && user && (
              <>
                <div className="mb-8">
                  <h1 className="text-4xl font-display font-bold mb-2">Welcome back, {user.username}</h1>
                  <p className="text-glass-muted">Here is what's happening in Los Santos today.</p>
                </div>
                <Dashboard user={user} properties={properties} />
              </>
            )}

            {view === ViewState.AFFILIATIONS && user && (
              <AffiliationsPanel affiliations={user.affiliations || []} />
            )}

            {view === ViewState.COMMUNITY && (
              <CommunityPanel tickets={MOCK_TICKETS} />
            )}

            {view === ViewState.ADMIN && (
               <AdminPanel tickets={MOCK_TICKETS} logs={MOCK_SERVER_LOGS} players={MOCK_ALL_PLAYERS} />
            )}

            {view === ViewState.LEADERBOARD && (
              <>
                 {loadingLeaderboard ? (
                    <div className="flex justify-center p-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                 ) : (
                    <Leaderboard data={leaderboardData} title="Richest Players" />
                 )}
              </>
            )}

            {view === ViewState.PROPERTIES && (
               <div className="animate-fade-in-up">
                 <div className="mb-8">
                  <h1 className="text-3xl font-display font-bold mb-2">Property Management</h1>
                  <p className="text-glass-muted">Manage your real estate and vehicles.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {properties.map(p => (
                     // Reusing property card logic but expanded for this view
                     <div key={p.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 overflow-hidden relative group hover:border-white/20 transition-all">
                        <div className="w-full h-48 rounded-xl mb-4 bg-white/5 overflow-hidden flex items-center justify-center p-4">
                          <img
                            src={p.imageUrl}
                            className="max-w-full max-h-full object-contain object-center opacity-90 group-hover:opacity-100 transition-opacity"
                            alt={p.name}
                          />
                        </div>
                        <h3 className="text-xl font-bold">{p.name}</h3>
                        <p className="text-glass-muted mb-4">{p.location}</p>
                        <button className="w-full py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg transition-colors border border-blue-500/20">View Details</button>
                     </div>
                   ))}
                </div>
               </div>
            )}

            {view === ViewState.SETTINGS && (
              <div className="animate-fade-in-up max-w-2xl">
                 <h1 className="text-3xl font-display font-bold mb-6">Settings</h1>
                 <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                    <div>
                      <h3 className="text-lg font-bold mb-2">Account Security</h3>
                      <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-colors">Change Password</button>
                    </div>
                    <div className="pt-6 border-t border-white/5">
                      <h3 className="text-lg font-bold mb-2">Integrations</h3>
                      <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-[#5865F2] flex items-center justify-center">
                             <span className="font-bold text-white">D</span>
                           </div>
                           <div>
                             <p className="font-medium">Discord</p>
                             <p className="text-xs text-green-400">Connected as User#1234</p>
                           </div>
                        </div>
                        <button className="text-xs text-red-400 hover:text-red-300">Unlink</button>
                      </div>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}