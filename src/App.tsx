// npm modules 
import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

// pages
import Signup from './pages/Signup/Signup'
import Login from './pages/Login/Login'
import Landing from './pages/Landing/Landing'
import ProfilePage from './pages/ProfilePage/ProfilePage.js'
import ChangePassword from './pages/ChangePassword/ChangePassword'
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy.js'

// components
// import NavBar from './components/NavBar/NavBar'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import AppBar from './components/AppBar/AppBar.jsx'
import Footer from './components/Footer/Footer.js'

// services
import * as authService from './services/authService'
import * as profileService from './services/profileService'

// styles
import './App.css'

// types
import { Profile, User } from './types/models'

function App(): JSX.Element {
  const [user, setUser] = useState<User | null>(authService.getUser());
  const [profile, setProfile] = useState<Profile | null>(null);
  const navigate = useNavigate()
  
  const handleLogout = (): void => {
    authService.logout()
    setUser(null)
    navigate('/')
  }

  const handleAuthEvt = (): void => {
    setUser(authService.getUser())
  }
  useEffect((): void => {
    const fetchProfile = async (): Promise<void> => {
      try {
        if (user) {
          const profileData: Profile = await profileService.getProfileById(user.profile.id.toString());
          setProfile(profileData);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfile()
  }, [user])

  return (
    <>
      <AppBar user={user} handleLogout={handleLogout}/>
      <Routes>
        <Route path="/" element={<Landing user={user}/>} />
        <Route
          path="/auth/profile"
          element={
            <ProtectedRoute user={user}>
              <ProfilePage profile={profile} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/auth/signup"
          element={<Signup handleAuthEvt={handleAuthEvt} />}
        />
        <Route
          path="/auth/login"
          element={<Login handleAuthEvt={handleAuthEvt} />}
        />
        <Route path='/auth/logout' element={<Landing user={user}/>}/>
        <Route
          path="/auth/change-password"
          element={
            <ProtectedRoute user={user}>
              <ChangePassword handleAuthEvt={handleAuthEvt} />
            </ProtectedRoute>
          }
        />
        <Route path='/privacy' element={<PrivacyPolicy />}/>
      </Routes>
      <Footer />
    </>
  )
}

export default App
