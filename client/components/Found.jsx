'use client'

import React, { useEffect, useState } from 'react'
import { IoIosRefresh } from "react-icons/io"

const Found = () => {
    const [foundPlaqueLocation, setFoundPlaqueLocation] = useState([])
    const [originalData, setOriginalData] = useState([]); // Orijinal veriyi saklamak için ekledik
    const [filters, setFilters] = useState('')

    const api = async () => {
        const response = await fetch('http://localhost:5000/api/v1/plaque/found', {
            method: 'GET'
        });
        const result = await response.json()
        if (result.success === true) {
            setFoundPlaqueLocation(result.data)
            setOriginalData(result.data) // Orijinal veriyi burada sakladık
        }
    };

    const filterPlaques = () => {
        const filteredPlaques = originalData.filter(data => {
            return data.plaqueName.toLowerCase().includes(filters.toLowerCase())
        })
        setFoundPlaqueLocation(filteredPlaques)
    }


    useEffect(() => {
        api()
    }, [])

    useEffect(() => {
        filterPlaques()
    }, [filters, originalData]); // filters ve originalData bağımlılıklarını ekledik
    return (
        <div>
            <div className="p-8 rounded-lg">
                <h1 className="text-5xl w-full font-roboto text-black mb-16 underline underline-offset-8">Bulunan Plakalar</h1>

                <div className="flex flex-row gap-4 mt-8">
                    <input
                        onChange={(e) => setFilters(e.target.value)}
                        id="plaque"
                        type="text"
                        className="w-1/2 h-10 border rounded-xl outline-none  border-gray-200 focus:border-2"
                        placeholder="Bulunan Plakalar Tablosunu Filtrele"
                    />
                    <button
                        onClick={() => filterPlaques()}
                        className="w-40 hover:bg-blue-700 border p-2 text-white bg-blue-500  rounded-lg font-roboto"
                    >
                        Filtreleme
                    </button>
                </div>
                <div className='w-[100%]  flex flex-row items-center justify-center mb-4 mt-16'>
                    <button onClick={() => api()} className='bg-blue-500 rounded-full p-2 text-white hover:bg-blue-600 font-roboto'>
                        <IoIosRefresh />
                    </button>
                </div>

                <div className="relative overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm text-left rtl:text-right text-black  ">
                        <thead className="  uppercase bg-gray-900 text-white ">
                            <tr className='bg-slate-700'>
                                <th scope="col" className="px-6 py-3 ml-8">
                                    Bulunan Plakalar
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Konum
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Tarih
                                </th>

                            </tr>
                        </thead>
                        <tbody>
                            {foundPlaqueLocation.map((data, index) => (
                                <tr className="bg-white border-b ">
                                    <th scope="row" className="px-6 py-4  text-black whitespace-nowrap   text-custom">
                                        {data.plaqueName}
                                    </th>
                                    <td className="px-6 py-4 text-custom text-black font-bold">
                                        {data.foundLocation[0]}
                                    </td>
                                    <td className="px-6 py-4 text-custom text-black font-bold " >
                                        {data.dateAndClock[0]}
                                    </td>
                                </tr>

                            ))}

                        </tbody>
                    </table>
                </div>


            </div>
        </div>
    )
}

export default Found
