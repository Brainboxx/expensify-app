import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  
  const [authTokens, setAuthTokens] = useState(() => 
    localStorage.getItem("authTokens") 
    ? JSON.parse(localStorage.getItem("authTokens"))
    : null
  )
  const [user, setUser] = useState(() => 
    localStorage.getItem("authTokens")
    ? jwtDecode(localStorage.getItem("authTokens"))
    : null
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const loginUser = async (email, password) => {
    const response = await fetch("https://expensify-tyv2.onrender.com/api/token/", {
      method: "POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        email, password
      })
    })
    const data = await response.json()
    
    if(response.status === 200){
      setAuthTokens(data)
      setUser(jwtDecode(data.access))
      localStorage.setItem("authTokens", JSON.stringify(data))
      navigate("/dashboard")
    } else {
      console.log(response.status);
      console.log("there was a server error")
      setError('Invalid Email or Password')
    }
  }

  const registerUser = async (first_name, last_name, 
    email, password, password2) => {

      const userData = {
        first_name,
        last_name,
        email,
        password,
        password2
      };

      const response = await fetch("https://expensify-tyv2.onrender.com/register/", {
        method: 'POST',
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify(userData)
      })
      if(response.status === 201){
        navigate('/login')
      } else {
        alert("Something went wrong" + response.status)
      }
  }

  const logoutUser = () => {
    setAuthTokens(null)
    setUser(null)
    localStorage.clear()
    navigate("/login")
  }

  const contextData = {
    user,
    setUser,
    authTokens,
    error,
    setAuthTokens,
    registerUser,
    loginUser,
    logoutUser
  }

  useEffect(() => {
    if(authTokens){
      setUser(jwtDecode(authTokens.access))
    }
    setLoading(false)
  }, [authTokens, loading])

  return (
    <AuthContext.Provider value={contextData}>
      {loading? null : children}
    </AuthContext.Provider>
  )

}