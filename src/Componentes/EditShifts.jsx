/*import React, { useState, useEffect } from 'react';
import Spinner from '../Componentes/Spinner';
import Swal from 'sweetalert2';

const EditShiffs = () => {
    const [shiffs,setShiffs]=useState([]);
    const [loading,setLoading]=useState(true);
    useEffect(()=>{
        const fetchShiffs = async ()=>{
            try {
                const listShiffs = await fetch("http://localhost:3000/shiff");
                const response = await listShiffs.json()
                setShiffs(response.data)
                setTimeout(()=>{
                    setLoading(false);
                },2000);

            } catch (error) {
                setLoading(false)
            }
        }
        fetchShiffs();
    },[])

    return (
    <h2>EditShiffs</h2>
    )
}

export default EditShiffs;*/