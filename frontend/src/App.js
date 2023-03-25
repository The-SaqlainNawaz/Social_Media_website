import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./components/HomePage"
// import { useMemo } from "react"
import BrandExample from "./components/Navbar"
// import SideBar from './components/SideBar'
import DiscoverFriends from "./components/DiscoverFriends"
import ProfilePage from "./components/ProfilePage"
import LoginPage from "./components/LoginPage"
import SignupPage from "./components/SIgnupPage"
import Messanger from "./components/Messanger"
import UploadImage from "./components/UploadImagePage"
import UserState from "./Context/UserState"
import FriendsPage from "./components/FriendsPage"
import ProfileFriends from "./components/ProfileFriends"

function App() {
  return (
    <UserState>
      <div className="app">
        <BrowserRouter>
          <BrandExample />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/friends" element={<DiscoverFriends />}></Route>
            <Route path="/profile" element={<ProfilePage />}></Route>
            <Route path="/login" element={<LoginPage />}></Route>
            <Route path="/signup" element={<SignupPage />}></Route>
            <Route path="/messanger" element={<Messanger />}></Route>
            <Route path="/upload" element={<UploadImage />}></Route>
            <Route path="/discover" element={<FriendsPage />}></Route>
            <Route path="/friendsprofile" element={<ProfileFriends />}></Route>
            {/* <Route
                        path="/home"
                        element={isAuth ? <HomePage /> : <Navigate to="/" />}
                    />
                    <Route
                        path="/profile/:userId"
                        element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
                    /> */}
          </Routes>
        </BrowserRouter>
      </div>
    </UserState>
  )
}

export default App
