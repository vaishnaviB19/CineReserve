import React from 'react'
import {Routes,Route, useLocation} from 'react-router-dom'
import Navbar from './Components/Navbar'
import Home from './Pages/Home'
import Movies from './Pages/Movies'
import MovieDetails from './Pages/MovieDetails'
import SeatLayout from './Pages/SeatLayout'
import MyBookings from './Pages/MyBookings'
import Favorite from './Pages/Favorite'
import Footer from './Components/Footer'
import {Toaster} from 'react-hot-toast'
import Layout from './Pages/admin/Layout'
import Dashboard from './Pages/admin/Dashboard'
import AddShows from './Pages/admin/AddShows'
import ListShows from './Pages/admin/ListShows'
import ListBookings from './Pages/admin/ListBookings'
const App = () => {
  const isAdminRoute=useLocation().pathname.startsWith('/admin')
  return (
    <>
    <Toaster/>
    {!isAdminRoute && <Navbar/>}
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/movies' element={<Movies/>} />
      <Route path='/movies/:id' element={<MovieDetails/>} />
      <Route path='/movies/:id/:date' element={<SeatLayout/>} />
      <Route path='/my-bookings' element={<MyBookings/>} />
      <Route path='/favorites' element={<Favorite/>} />
      <Route path="/admin" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-shows" element={<AddShows />} />
          <Route path="list-shows" element={<ListShows />} />
          <Route path="list-bookings" element={<ListBookings />} />
      </Route>

    </Routes>
    {!isAdminRoute && <Footer/>}
    </>
  )
}

export default App
