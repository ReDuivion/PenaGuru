'use client'
// pages/editadmin.js
import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { useRouter } from 'next/navigation';
import {Button} from "@nextui-org/react";
import { GoX } from "react-icons/go";
export default function EditAdmin() {
  const [userEmail, setUserEmail] = useState(null);
  const [userData, setUserData] = useState({
    nama_user: '',
    jenis_user: '',
  });
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          console.error('Error fetching user:', error.message);
          // Redirect or handle error as needed
          return;
        }

        setUserEmail(user.email);

        // Check if email exists in staffs
        const { data: existingStaffData, error: existingStaffError } = await supabase
          .from('admins')
          .select('*')
          .eq('email', user.email)
          .single();

        // Check if email exists in profiles
        const { data: existingProfileData, error: existingProfileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', user.email)
          .single();

        if (existingStaffError || existingProfileError) {
          console.error('Error checking existing staff or profile:', existingStaffError?.message || existingProfileError?.message);
        }

        if (existingStaffData || existingProfileData) {
          console.log('Email sudah ada di tabel "admins" atau "profiles", redirect ke /editstaff atau /edit');
          // Redirect ke halaman yang sesuai
          router.push(existingStaffData ? '/editstaff' : '/edit');
          return;
        }

        // Continue with fetching admin data
        const { data: adminData, error: adminError } = await supabase
          .from('staffs')
          .select('*')
          .eq('email', user.email)
          .single();

        if (adminError) {
          console.error('Error fetching admin data:', adminError.message);
          // Redirect or handle error as needed
          return;
        }

        setUserData(adminData || {});
      } catch (error) {
        console.error('Error fetching user or admin data:', error.message);
        // Redirect or handle error as needed
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Use select to check if user already exists in staffs or profiles
      const { data: existingStaffData, error: existingStaffError } = await supabase
        .from('admins')
        .select('*')
        .eq('email', userEmail)
        .single();

      const { data: existingProfileData, error: existingProfileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', userEmail)
        .single();

      if (existingStaffError || existingProfileError) {
        console.error('Error checking existing admins or profile:', existingStaffError?.message || existingProfileError?.message);
      }

      if (existingStaffData || existingProfileData) {
        console.log('Email sudah ada di tabel "admins" atau "profiles", redirect ke /editstaff atau /edit');
        // Redirect ke halaman yang sesuai
        router.push(existingStaffData ? '/editstaff' : '/edit');
        return;
      }

      // Continue with the update or insert in admins
      const { data: existingUserData, error: existingUserError } = await supabase
        .from('staffs')
        .select('*')
        .eq('email', userEmail)
        .single();

      if (existingUserError) {
        console.error('Error checking existing user:', existingUserError.message);
      }

      if (existingUserData) {
        // User exists, perform update
        const { data, error } = await supabase
          .from('staffs')
          .update({
            nama_user: userData.nama_user,
            jenis_user: userData.jenis_user,
            // Add more fields here...
          })
          .eq('email', userEmail);

        if (error) {
          console.error('Error updating user profile:', error.message);
          // Redirect or handle error as needed
          return;
        }

        console.log('User profile updated successfully:', data);
      } else {
        // User does not exist, perform insert
        const { data, error } = await supabase
          .from('staffs')
          .insert([
            {
              email: userEmail,
              nama_user: userData.nama_user,
              jenis_user: userData.jenis_user,
              // Add more fields here...
            },
          ]);

        if (error) {
          console.error('Error inserting user profile:', error.message);
          // Redirect or handle error as needed
          return;
        }

        console.log('User profile inserted successfully:', data);
      }

      // Redirect to the desired page after successful update or insert
      // router.push("/dashboard");
    } catch (error) {
      console.error('Error updating/inserting user profile:', error.message);
      // Redirect or handle error as needed
    }
  };

  return (
    <div className="card w-96 h-auto  shadow-xl mx-auto mt-8 bg-slate-200">
      <h1 className='text-2xl text-center m-4'>Edit Profile</h1>
      <div class="avatar">
  <div class="w-24 rounded-full items-center justify-center text-center mx-auto">
    <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
  </div>  
</div>
<div className='text-center m-4'>
      <h1>{userEmail}</h1>
      <form onSubmit={handleFormSubmit}>
        <label><p className='text-lg'>
          Nama User:</p>
          <input
            type="text"
            name="nama_user"
            value={userData.nama_user}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label><p className='text-lg'>
          Jenis User:</p>
          <input
            type="text"
            name="jenis_user"
            value={userData.jenis_user}
            onChange={handleInputChange}
          />
        </label>
        <br />
        {/* Add more input fields here... */}
        <div className="flex gap-4 items-center justify-center m-4">
        <Button
                color="danger"
                variant="solid"
                type="submit"
              >
                Simpan perubahan
              </Button> 
      </div>
      </form>
      </div>
    </div>
  );
}
