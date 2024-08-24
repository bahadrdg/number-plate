'use client'
import React, { useEffect, useRef, useState } from 'react';
import { TiDeleteOutline } from 'react-icons/ti';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Searching = () => {

    //* FOTO
    const [selectedImage, setSelectedImage] = useState(null)

    const handleImageChange = (event) => {
        const file = event.target.files[0]
    
        if (file) {
          const reader = new FileReader()
    
          reader.onload = (e) => {
            setSelectedImage(e.target.result)
          }
    
          reader.readAsDataURL(file)
        }
      }



    const toastContent = (toastMessage) => toast(toastMessage)

    const [originalWanted, setOriginalWanted] = useState([])
    const [wanted, setWanted] = useState([])

    useEffect(() => {
        const getPlaque = async () => {
            const response = await fetch('http://localhost:5000/api/v1/plaque/', {
                method: 'GET',
            });
            const returnResponse = await response.json()
            if (returnResponse.success === true) {
                setOriginalWanted(returnResponse.data)
                setWanted(returnResponse.data)
            }
        };
        getPlaque()
    }, [])

    const inputRef = useRef();

    const api = async () => {
        let plaque = inputRef.current.value
    
        const response = await fetch('http://localhost:5000/api/v1/plaque/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plaque }),
        });
    
        const returnResponse = await response.json();
    
        if (returnResponse.success === true) {
            const newPlaque = { plaqueName: plaque, _id: returnResponse.data._id }
            setOriginalWanted([...originalWanted, newPlaque])
            setWanted([...originalWanted, newPlaque])
            inputRef.current.value = ''
        } else {
            console.log(returnResponse)
            toastContent(returnResponse.message)
            inputRef.current.value = ''
        }
    }
    

    const [dataFilter, setDataFilter] = useState('')

    useEffect(() => {
        if (dataFilter) {
            const response = originalWanted.filter((data) => {
                return data.plaqueName.includes(dataFilter)
            })
            setWanted(response)
        } else {
            setWanted(originalWanted)
        }
    }, [dataFilter, originalWanted])


    const deletePlaque = async (id) => {
        const response = await fetch(`http://localhost:5000/api/v1/plaque/${id}`, {
            method: 'DELETE'
        });
        const result = await response.json()
        if (result.success === true) {
            // Silinen veriyi çıkart
            const updatedOriginalWanted = originalWanted.filter(data => data._id !== id)
            const updatedWanted = wanted.filter(data => data._id !== id)
    
            // Güncellenmiş veriyi set et
            setOriginalWanted(updatedOriginalWanted)
            setWanted(updatedWanted)
        } else {
            // Silme işlemi başarısızsa
            console.log(result.message)
            toastContent(result.message)
        }
    };


   

    


    return (
        <>
            <div className="   rounded-sm flex flex-col p-8 ">
                <h1 className="text-5xl font-roboto text-black mb-16 underline underline-offset-8">Aranan Plakalar</h1>
                
                <label className='text-gray-500 mb-2'>Fotograf İle Arama Başlat</label>
                <input onChange={handleImageChange} type='file' className='border-2 w-[75%] rounded-lg bg-slate-500 text-white mb-4'/> 

                {selectedImage && (
                    <div className='mb-8 w-[75%]'>
                        <img src={selectedImage} alt='Selected' className='rounded-lg' />
                    </div>
                )}

                <div className="flex flex-row gap-4 ">
                    <input
                        ref={inputRef}
                        id="plaque"
                        type="text"
                        className="w-1/2 h-10 border rounded-xl outline-none  border-gray-200 focus:border-2"
                        placeholder="Plaka Araması Başlat"
                    />
                    <button onClick={() => api()} className="w-40 hover:bg-blue-700 border p-2 text-white bg-blue-500  rounded-lg font-roboto">
                        Ara
                    </button>
                </div>

                <div className="flex flex-row gap-4 mt-8 ">
                    <input
                        onChange={(e) => setDataFilter(e.target.value)}
                        id="plaque"
                        type="text"
                        className="w-1/2 h-10 border rounded-xl outline-none  border-gray-200 focus:border-2"
                        placeholder="Aranan Plakalar Tablosunu Filtrele"
                    />
                    <button className="w-40 hover:bg-blue-700 border p-2 text-white bg-blue-500  rounded-lg font-roboto">Filtreleme</button>
                </div>

                <div className="flex flex-col gap-4 mt-8">
                    <table className="flex flex-col  lg:w-[75%] sm:w-[100%] xsm:w-[100%] md:w-[100%] overflow-x-auto  rounded-lg">
                        <thead>
                            <tr className="bg-slate-700 flex flex-row items-center h-12 p-3 ">
                                <th className="text-white  ml-16 mr-auto">Aranan Plakalar</th>
                                <th className="text-white mr-16 ">Aramadan Çıkart</th>
                            </tr>
                        </thead>
                        <tbody>
                            {wanted &&
                                wanted.map((data, index) => {
                                    return (
                                        <tr key={index} className="flex flex-row items-center h-14 p-3 border ">
                                            <th className="text-black ml-16 mr-auto">{data.plaqueName}</th>
                                            <th className="text-red-500 mr-28">
                                                <button onClick={() => deletePlaque(data._id)} className='hover:text-red-200'>
                                                    <TiDeleteOutline className="text-3xl font-thin" />
                                                </button>
                                            </th>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>

                <ToastContainer></ToastContainer>
            </div>
        </>
    );
};

export default Searching;
