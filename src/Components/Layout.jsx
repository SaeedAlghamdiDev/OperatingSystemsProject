import { Navbar } from "./Navbar"
import { Outlet } from "react-router-dom"
import Footer from "./Footer"
export function Layout() {

    return (<>

        <Navbar />

        <main>
            <Outlet />
        </main>
        <Footer />
    </>)
}