"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "../../config/supabase";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Stack,
  StackDivider,
  Text,
  Box,
} from "@chakra-ui/react";
import Image from "next/image"
export default function Statistik() {
const [user, setUser] = useState(null);
  const [absensi, setAbsensi] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error) {
          console.error("Error fetching user data:", error.message);
          return;
        }

        setUser(user);

        if (!user || !user.email) {
          console.error("User or user email is null or undefined.");
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("")
          .eq("email", user.email)
          .single();
        if (profileError) {
          console.error("Error fetching profile data:", profileError);
          return;
        }

        const guruId = profileData?.id;
        if (!guruId) {
          console.error("Guru ID is null or undefined.");
          return;
        }

        const { data: absensiData, error: absensiError } = await supabase
          .from("absensi")
          .select("")
          .eq("id_guru", guruId);
        if (absensiError) {
          console.error("Error fetching absensi data:", absensiError);
          return;
        }

        setAbsensi(absensiData);

        for (const absen of absensiData) {
          const res = await supabase.storage
            .from("guru")
            .getPublicUrl(absen.foto_kegiatan);

          if (res.error) {
            console.error("Error fetching image URL:", res.error.message);
          } else {
            absen.foto_kegiatan_url = res.data.publicUrl;
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    }

    fetchData();
  }, [user]);
  return (
    <>
      {/* <div className="stats shadow m-5">
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
</div> */}<Card className="items-center"> 
  <div>
   {absensi.map((absen, index) => (
    <div className="stat" key={index}>
      <Card maxW='sm' >
        <CardHeader>
          <Heading size="md" className="text-center">PRELISENCE</Heading>
        </CardHeader>

        <CardBody>
       
          <Stack divider={<StackDivider />} spacing="4">
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Jam masuk
              </Heading>
              <Text pt="2" fontSize="sm">
                {absen.check_in}
              </Text>
            </Box>
            <Box>
              <Heading size="xs" textTransform="uppercase">
                jam keluar
              </Heading>
              <Text pt="2" fontSize="sm">
               {absen.check_out}
              </Text>
            </Box>
            <Box>
              <Text pt="2" fontSize="sm">
              {absen.foto_kegiatan_url && (
              <div className="">
                <p>
                <Image
                  className='items-center'
                  width={50}
                  height={50}
                  src={absen.foto_kegiatan_url}
                  alt="Kegiatan"
                /></p>
              </div>
            )}
              </Text>
            </Box>
          </Stack>
       
        </CardBody>  
      </Card> </div>
  ))}</div>
      </Card>
    </>
  );
}
