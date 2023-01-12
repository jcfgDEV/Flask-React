'use client'
import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Page() {

    //Datos de cada campo de input
    const [Nombre, setNombre] = useState("");
    const [Asunto, setAsunto] = useState("");
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");

    //Guardar los datos de la base de datos
    const [MongoDB, setMongoDB] = useState([])

    

    const GetUsers = async (e) => {
        const res = await fetch('https://react-flask-eu6zmpj0l-jcfgdev.vercel.app/usersGet')
        const data = await res.json()
        setMongoDB(data);
    }

    useEffect(() => {
        GetUsers();
    }, [])

    const PostSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("https://react-flask-eu6zmpj0l-jcfgdev.vercel.app/userAdd", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Nombre,
              Asunto,
              Email,
              Password,
            }),
          })

          const response = await res.json()
          const Notify = () => {
            toast.success(response.Message, {
              position: "bottom-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
          Notify();
          

          setNombre('');
          setAsunto('');
          setEmail('');
          setPassword('');
          GetUsers();
          
    }


    const UserDelete = async (id) => {
        const res = await fetch(`https://react-flask-eu6zmpj0l-jcfgdev.vercel.app/usersDelete/${id}`, {
            method: "DELETE",
          });
         const response = await res.json();
         const NotifyError = () => toast.error(response.Message, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
            NotifyError();
          await GetUsers();
    }


    return (
        <>
        <ToastContainer theme='colored'/>
            <h1 className=" font-extrabold text-red-600 text-6xl p-10">Flask & React</h1>
            <div className="">
                <div className="flex justify-center">
                    <form className=" border border-black grid grid-cols-1 p-5 bg-red-500" onSubmit={PostSubmit}>
                        <input 
                        type='text'
                        name="Nombre"
                        placeholder="John Doe"
                        className="border border-black bg-gray-100 w-max p-3 m-2 outline-none shadow-xl"
                        onChange={e => setNombre(e.target.value)}
                        value={Nombre}
                        />
                        <input 
                        type='text'
                        name="Asunto"
                        placeholder="Topic or Subject..."
                        className="border border-black bg-gray-100 w-max p-3 m-2 outline-none shadow-xl"
                        onChange={e => setAsunto(e.target.value)}
                        value={Asunto}
                        />
                        <input 
                        type='email'
                        name="Email"
                        placeholder="John@example.com"
                        className="border border-black bg-gray-100 w-max p-3 m-2 outline-none shadow-xl"
                        onChange={e => setEmail(e.target.value)}
                        value={Email}
                        />
                        <input 
                        type='password'
                        name="Password"
                        placeholder="password"
                        className="border border-black bg-gray-100 w-max p-3 m-2 outline-none shadow-xl"
                        onChange={e => setPassword(e.target.value)}
                        value={Password} 
                        />
                        <div className="flex justify-center">
                            <input 
                            type='submit'
                            value='Create'
                            className="border border-none p-2 rounded-sm bg-black text-white w-40 m-2 shadow-xl cursor-pointer"
                            />
                        </div>
                    </form>
                </div>
            </div>
           <div className="flex justify-center p-5">
           <table className="w-full table table-fixed">
                <thead>
                    <tr className="bg-red-500">
                        <th className="text-center border border-black ">ID</th>
                        <th className="text-center border border-black ">NOMBRE</th>
                        <th className="text-center border border-black ">EMAIL</th>
                        <th className="text-center border border-black ">ASUNTO</th>
                        <th className="text-center border border-black ">PASSWORD</th>
                        <th className="text-center border border-black" >Accion</th>
                    </tr>
                </thead>
                <tbody>
                    {MongoDB.map((item,index) =>(
                        <tr key={index} className=''>
                            <td className="text-center border bg-slate-200 border-black text-sm break-words p-1">{item._id['$oid']}</td>
                            <td className="text-center border bg-slate-200 border-black text-sm  p-1">{item.nombre}</td>
                            <td className="text-center border bg-slate-200 border-black text-sm p-1  ">{item.email}</td>
                            <td className="text-center border bg-slate-200 border-black text-sm  p-1">{item.asunto}</td>
                            <td className="text-center border bg-slate-200 border-black break-words text-sm  ">{item.password}</td>
                            <td className="text-center border bg-slate-200 border-black break-words text-sm">
                                <div className="grid grid-cols-2 gap-2 m-1">
                                    <button className="bg-red-500 hover:bg-blue-dark text-white font-bold p-1 rounded" onClick={(e) => UserDelete(item._id['$oid'])}>
                                        Delete
                                    </button>
                                    <button
                                    className=" bg-orange-400 hover:bg-blue-dark text-white font-bold p-1 rounded">
                                        Updated
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}    
                </tbody>
            </table>
           </div>
        </>
    )
  }