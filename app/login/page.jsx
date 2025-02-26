'use client'
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
const FormSchema = z.object({
  username: z.string().min(1, {
    message: "Username is required.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

export default function Login() {

  const{register,handleSubmit,formState:{errors}} = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })  

   const { data: session } = useSession();
      if (session) redirect("/dashboard");

  const onSubmit = async (data) => {
   try {
     const result = await signIn("credentials", {
       username: data.username,
       password: data.password,
       // identification: JSON.stringify(identification),
       callbackUrl: "/dashboard",
       redirect: false,
     });
    console.log(result)
   } catch (error) {
    console.log(error)
   }
  }
  return (
      <>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Login
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                 Username
                </label>
                <input {...register("username")}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                
                />
                <p className="text-red-500">{errors.username?.message}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input {...register("password")}
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="••••••••"
                />
                <p className="text-red-500">{errors.password?.message}</p>
              </div>
        
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors">
                Sign In
              </button>
            </form>
          </div>
        </div>
      </> 
  );
}
