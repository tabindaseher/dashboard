 /* eslint-disable @typescript-eslint/no-unused-vars */
 /* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const Admin = () => {
    const[email , setEamil ]= useState("")
    const[password , setPassword ]= useState("")

    const router = useRouter()

    const handleLogin = (e: React.FormEvent)=>{
        e.preventDefault()
        

    if(email === "seher@gmail.com" && password === "seher"){
        localStorage.setItem("isLoggedIn", "true");
        router.push("/admin/dashboard")
    }
    else{
        alert("Invalid email or password")
    }
}

  return (
    <div className='flex justify-center items-center h-screen bg-gray-100'>
      <form onSubmit={handleLogin} className='bg-gray-50 p-6 rounded shadow-md '>
        <h2 className='text-xl text-center mb-4 font-bold'>Admin Login</h2>
        <input type='email'
        placeholder='Email' 
        onChange={(e)=> setEamil(e.target.value)}
        className='w-full p-3 mb-4 border border-blue-700 rounded' 

        value={email}
        />

<input type='password'
        placeholder='Password' 
        onChange={(e)=> setPassword(e.target.value)}
        className='w-full p-3 mb-4 border border-blue-700 rounded' 

        value={password}
        />
        <button type='submit' 
        className='bg-blue-700 text-white px-4 py-2 rounded-md w-full'>
          Login
        </button>
      </form>

    </div>
  )
}

export default Admin