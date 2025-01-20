import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar(){

    const [isOpen,setOption] = React.useState(false);
    const [isRing,setRing] = React.useState(false);

    const handleClick = ()=>{
        setOption(!isOpen);
        setRing(!isRing);
    }

    React.useEffect(()=>{
        const handleOutsideClick = (e)=>{
            const dropdown = document.getElementById("dropdown-menu");
            const button = document.getElementById("user-menu-button");

            if(dropdown && !dropdown.contains(e.target) && button && !button.contains(e.target)){
                setOption(false);
                setRing(false);
            }
        };
        document.addEventListener("mousedown",handleOutsideClick);
        return ()=>{
            document.removeEventListener("mousedown",handleOutsideClick);
        };
    })

    
    return (
        <>
        <div className="navbar pt-5 pl-1 pr-5">
            <nav className="w-full rounded-xl">
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                    <div className="relative flex h-14 items-center justify-between">
                        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                            <p className="px-3 py-2 text-md font-small text-black" aria-current="page">Sentiment Analysis</p>
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            <div className="relative ml-3">
                            <div>
                                <button 
                                type="button" 
                                className={`relative flex rounded-full bg-gray-800 text-sm focus:outline-none ${isRing?"focus:ring-2":""} focus:ring-black-400 focus:ring-offset-2 focus:ring-offset-gray-800`} 
                                id="user-menu-button" 
                                onClick={handleClick} 
                                aria-expanded={isOpen} 
                                aria-haspopup="true"
                                >
                                    <span className="absolute -inset-1.5"></span>
                                    <span className="sr-only">Open user menu</span>
                                    <img className="size-8 rounded-full" src="https://images.unsplash.com/photo-1725830826396-bcb0585da085?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyM3x8fGVufDB8fHx8fA%3D%3D" alt=" "/>
                                </button>
                            </div>
                            <div id="dropdown-menu" className={`absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none ${isOpen?"block":"hidden"}`} role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" >
                                <NavLink to="/" className="block px-4 py-2 text-sm text-gray-700" role="menuitem"  id="user-menu-item-0">Home</NavLink>
                                <NavLink to="/about" className="block px-4 py-2 text-sm text-gray-700" role="menuitem"  id="user-menu-item-1">About</NavLink>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
        </>
    )
}