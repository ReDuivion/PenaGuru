'use client'
import React from 'react'
import {Textarea} from "@nextui-org/react";
import daisyui from 'daisyui';
import {useState, useEffect} from 'react';
import { supabase } from '../../config/supabase';
export default function Statistik() {
 const [userEmail,setUSerEmail]=useState(null)
 const [absensi,setAbsensi]=useState([])
 useEffect(()=>{
  async function ambilData(){
    const { data: { user } } = await supabase.auth.getUser()
    setUSerEmail(user)
    const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('email',user.email)
  if(error){
    
  }else{
    const guruId=data[0]?.id
    if(guruId){
      const { data:absensiData, error:absensiError } = await supabase
      .from('absensi')
      .select('*')
      .eq('id_guru',guruId)
      if(error){
        console.error(absensiError)
      }else{
        setAbsensi(absensiData)
      }
    }
  }

  }
  ambilData()
 },[userEmail]
 )
  return (
    <>
   <div className="stats shadow m-5">
  {absensi.map((absen, index) => (
    <div className="stat" key={index}>
      <div className="stat-figure text-secondary"></div>
      <div className="stat-title">Jam Masuk</div>
      <div className="stat-value text-xl">{absen.check_in}</div>

      <div className="stat-figure text-secondary"></div>
      <div className="stat-title">Jam Keluar</div>
      <div className="stat-value text-xl">{absen.check_out}</div>

      <div className="stat-figure text-secondary"></div>
      <div className="stat-desc">Monday, January 10, 2024</div>
    </div>
  ))}
</div>

    </>
  )
}
