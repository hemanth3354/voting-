
import React from 'react'
import { Outlet, useLocation } from "react-router-dom"
import Navbar from "../components/Navbar"

const RootLayout = () => {
    const location = useLocation()
    const isLoginPage = location.pathname === '/' || location.pathname === '/login'

    return (
        <>
        <Navbar />
        <Outlet/>
        </>
    )
}
export default RootLayout
