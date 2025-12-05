
"use client";

import { HTTP_BACKEND_URL } from "@/config";
import axios from "axios";
import { useState } from "react";

type props = {
    isSignin: boolean;

}

export function AuthPage({isSignin} : {
    isSignin: boolean;
}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if(isSignin) {
            // Signin logic
            try{
                const res = await axios.post(`${HTTP_BACKEND_URL}/signin`, {
                    email,
                    password
                });

                localStorage.setItem("token", res.data.token);
                window.location.href = "/dashboard";
            } catch(err) {
                setError("An error occurred during sign in.");
            } finally {
                setLoading(false);
            }
        } else {
            // Signup logic
            try{
                const res = await axios.post(`${HTTP_BACKEND_URL}/signup`, {
                    username,
                    email,
                    password
                });
                window.location.href = "/signin";
            } catch(err) {
                setError("An error occurred during sign Up.");
            } finally {
                setLoading(false);
            }
        }
        

    };

    return (<div className=" min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white p-8 round-2xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800x">
                { isSignin ? "Sign In to Your Account" : " Sign Up for an Account" }
            </h2>

            <form className=" space-y-5" onSubmit={handleSubmit}>
                { !isSignin && (<div>
                    <label className=" block text-base font-medium text-gray-700 mb-1">
                        Username
                    </label>
                    <input 
                    type="text" 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Your username"
                    value={username}
                    onChange={(e) => {setUsername(e.target.value)}}
                    />
                </div>)}
                <div>
                    <label className=" block text-base font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input 
                    type="email" 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="youremail@example.com"
                    value={email}
                    onChange={(e) => {setEmail(e.target.value)}}
                    />
                </div>
                <div>
                    <label className=" block text-base font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <div className="relative">
                        <input 
                        type={showPassword ? "text" : "password"}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => {setPassword(e.target.value)}}
                        />
                        <button
                            type="button"
                            className=" absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 text-sm"
                            onClick={() => {
                                setShowPassword(!showPassword)
                            }}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>
                <div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
                        disabled={loading}
                    >
                        { isSignin ? loading ? "Signing in..." : "Sign In" : loading ? "Signing up..." : "Sign Up" }
                    </button>
                </div>
            </form>
            {isSignin? (
                <p className=" text-center text-sm text-gray-600 mt-5">
                    Don't have an account?{" "}
                    <a className="text-blue-600 hover:underline" href="/signup">
                        Sign Up
                    </a>
                </p>
                ) : (
                    <p className=" text-center text-sm text-gray-600 mt-5">
                    Already have an account?{" "}
                    <a className="text-blue-600 hover:underline" href="/signin">
                        Sign In
                    </a>
                </p>
            )}
        </div>
    </div>);
}