import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from './pages/RootLayout'
import ErrorPage from './pages/ErrorPage'
import PrivacyPolicy from './pages/PrivacyPolicy'
import CookiePolicy from './pages/CookiePolicy'
import TermsConditions from './pages/TermsConditions'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Results from './pages/Results'
import Elections from './pages/Elections'
import ElectionDetails from './pages/ElectionDetails'
import Candidates from './pages/Candidates'
import Congrats from './pages/Congrats'
import Logout from './pages/Logout'
import Instructions from './pages/Instructions'
import VotersList from './pages/VotersList'
import TotalRegisteredVoters from './pages/TotalRegisteredVoters'
import AdminMessages from './pages/AdminMessages'





const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [

{
        index: true,
      element: <Login />
},
{
  path:"register",
  element: <Register />
},
{
  path:"results",
  element: <Results />
},
{
  path:"elections",
  element: <Elections />
},
{
  path:"elections/:id",
  element: <ElectionDetails />
},
{
  path:"elections/:id/candidates",
  element: <Candidates />
},
{
  path:"congrats",
  element: <Congrats />
},
{
  path:"Logout",
  element: <Logout/>
},
{
  path:"instructions",
  element: <Instructions/>
},
{
  path: "admin-messages",
  element: <AdminMessages />
},
{
  path: "privacy",
  element: <PrivacyPolicy />
},
{
  path: "cookies",
  element: <CookiePolicy />
},
{
  path: "terms",
  element: <TermsConditions />
},
{
  path: "contact",
  element: <Contact />
},
{
  path:"voters",
  element: <VotersList/>
},
{
  path:"total-registered-voters",
  element: <TotalRegisteredVoters/>
},
{
  path:"voters",
  element: <VotersList/>
},

    ]
  }

])






function App() {
  return (
  <RouterProvider router={router} />
  
 );
}

export default App;
