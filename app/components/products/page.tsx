import { Router, useRouter } from "next/router"
import { useEffect } from "react"

export default function ProductedRoute ({children}:{children : React.ReactNode}){
    const router = useRouter()

    useEffect(()=>{
        const isLoggedIn = localStorage.getItem("IsLogined")
        if(!isLoggedIn){
            router.push("/admin")
        }

    },[router])
    return (
        <>
            {children}
        </>
    )

}