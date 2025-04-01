import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const Appcontext = createContext()

const AppContextProvider = (props) => {


    const [user, setUser] = useState(null);
    const navigate = useNavigate()
    const [showLogin, setShowLogin] = useState(false)
    const backendUrl = 'http://localhost:4000'
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [credit, setCredit] = useState(false);

    const loadCreditdsData = async()=>{
        try {
            const{data}= await axios.get('http://localhost:4000/api/user/credits',{headers:{token}})
            if (data.success) {
                console.log(data)
                setCredit(data.credits)
                setUser(data.user.name)

                
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
            
        }
    }

    const logout=()=>{
        localStorage.removeItem('token')
        setToken('')
        setUser(null)
    }

    const generateImage = async(prompt)=>{
        try {
            const{data}=await axios.post('http://localhost:4000/api/image/generate-image',{prompt},{headers:{token}})
            console.log(data)
            if (data.success) {
                loadCreditdsData()
                return data.resultImage
                
            }
            else{
                toast.error(data.message)
                loadCreditdsData()
                if (data.creditBalance === 0) {
                    navigate('/buy')
                    
                }
            }
        } catch (error) {
            toast.error(error.message);
            
        }
    }
    useEffect(()=>{
        if (token) {
            loadCreditdsData();
            
        }

    },[token])


    const valuse = {
        user, setUser, navigate, showLogin, setShowLogin, backendUrl, token, setToken, credit, setCredit,loadCreditdsData,logout,generateImage
    }
    return <Appcontext.Provider value={valuse}>
        {props.children}
    </Appcontext.Provider>

}
export default AppContextProvider;