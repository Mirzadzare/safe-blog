import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import About from './pages/About'
import Header from './components/Header'
import Footer from './components/Footer'
import Projects from './pages/Projects'
import PrivateRoute from './components/PrivateRoute'
import Dashboard from './pages/Dashboard'
import Toast from './components/Toast'
import CreatePost from './pages/CreatePost'
import UpdatePost from './pages/UpdatePost'
import AdminPrivateRoutes from './components/AdminPrivateRoutes'
import PostsTab from './components/dashboardTabs/PostsTab'
import UsersTab from './components/dashboardTabs/UsersTab'
import Post from './pages/Post'

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/sign-in' element={<SignIn />} />
            <Route path='/sign-up' element={<SignUp />} />
            <Route element={<PrivateRoute />}>
              <Route path='/dashboard' element={<Dashboard />} />
            </Route>
            <Route element={<AdminPrivateRoutes />}>
              <Route path='/create-post' element={<CreatePost />} />
              <Route path='/update-post/:postId' element={<UpdatePost />} />
              <Route path='/posts' element={<PostsTab />} />
              <Route path='/users' element={<UsersTab />} />
            </Route>
              <Route path='/projects' element={<Projects />} />
              <Route path='/post/:postSlug' element={<Post />} />
            </Routes>
          <Toast />
        </main>
        
        <Footer />
      </div>
    </BrowserRouter>
  );
}
