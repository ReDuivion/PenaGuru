import React from 'react'
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
  } from '@chakra-ui/react'
  import {
    Button,
    NavbarBrand,
    NavbarContent

  }from '@nextui-org/react'
  import { FiMenu } from "react-icons/fi";

  import { useState } from 'react'
  export default function Draw() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [placement, setPlacement] = useState('left')
  
    return (
      <>
        
        <FiMenu size='2em' className='cursor-pointer'  onClick={onOpen}/>
        <Drawer placement={placement} onClose={onClose} isOpen={isOpen} className='bg-purple-500'>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader borderBottomWidth='1px'>
                <NavbarContent className=" pr-3" justify="center">
          <NavbarBrand>
            <p
              className="font-bold text-purple-500 cursor-pointer"
            >
              PenaGuru
            </p>
          </NavbarBrand>
        </NavbarContent></DrawerHeader>
            <DrawerBody>
              <p>Profile</p>
              <p>Dashboard</p>
              <p>Login</p>
              <p>Sign</p>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    )
  }