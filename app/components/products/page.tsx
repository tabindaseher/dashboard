// 'use client'
// import { useRouter } from "next/navigation"
// import { useEffect } from "react"

// export  function ProductedRoute ({children}:{children : React.ReactNode}){
//     const router = useRouter()

//     useEffect(()=>{
//         const isLoggedIn = localStorage.getItem("IsLogined")
//         if(!isLoggedIn){
//             router.push("/admin")
//         }

//     },[router])
//     return (
//         <>
//             {children}
//         </>
//     )

// }