 import React, { useState } from 'react'
import { Button } from "@chakra-ui/button";
 import { VStack } from "@chakra-ui/layout";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";

import { useToast } from "@chakra-ui/toast";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
 export const Signup = () => {
   const toast = useToast();
   const [show, setShow] = useState(true);
   const [name, setName] = useState();
   const [email, setEmail] = useState();
   const [confirmpassword, setConfirmpassword] = useState();
   const [password, setPassword] = useState();
   const [pic, setPic] = useState();
   const [picLoading, setPicLoading] = useState(false);
   const navigate= useNavigate();

   function changeHandler() {
     if (show) {
       setShow(false);
     } else {
       setShow(true);
     }
   }
   function postDetails(pics) {
     setPicLoading(true);
     if (pics === undefined) {
       toast({
         title: "Please Select an Image!",
         status: "warning",
         duration: 5000,
         isClosable: true,
         position: "bottom",
       });
       setPicLoading(false);
       return;
     }
     console.log(pics);
     if (
       pics.type === "image/jpeg" ||
       pics.type === "image/png" ||
       pics.type === "image/jpg"
     ) {
       const data = new FormData();
       data.append("file", pics);
       data.append("upload_preset", "chat-karo");
       data.append("cloud_name", "dpm2zoiac");
       fetch("https://api.cloudinary.com/v1_1/dpm2zoiac/image/upload", {
         method: "post",
         body: data,
       })
         .then((res) => res.json())
         .then((data) => {
           console.log(data);
           setPic(data.url.toString());
           console.log(data.url.toString());
           setPicLoading(false);
         })
         .catch((err) => {
           console.log(err);
           setPicLoading(false);
         });
     } else {
       toast({
         title: "Please Select an Image!",
         status: "warning",
         duration: 5000,
         isClosable: true,
         position: "bottom",
       });
       setPicLoading(false);
       return;
     }
   }

   const submitHandler = async() => {
  setPicLoading(true);
  if (!name || !email || !password || !confirmpassword) {
    toast({
      title: "Please Fill all the Feilds",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    setPicLoading(false);
    return;
  }
  if (password !== confirmpassword) {
    toast({
      title: "Passwords Do Not Match",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    return;
  }
  console.log(name, email, password, pic);

try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      console.log(data);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      navigate('/chat');
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };
   return (
     <VStack spacing="5px">
       <FormControl id="first-name" isRequired>
         <FormLabel>Name</FormLabel>
         <Input
           placeholder="Enter Your Name"
           onChange={(e) => setName(e.target.value)}
         />
       </FormControl>
       <FormControl id="email" isRequired>
         <FormLabel>Email Address</FormLabel>
         <Input
           type="email"
           placeholder="Enter Your Email Address"
           onChange={(e) => setEmail(e.target.value)}
         />
       </FormControl>

       <FormControl id="password" isRequired>
         <FormLabel>Password</FormLabel>
         <InputGroup size="md">
           <Input
             type={show ? "text" : "password"}
             placeholder="Enter Password"
             onChange={(e) => setPassword(e.target.value)}
           />
           <InputRightElement width="4.5rem">
             <Button h="1.75rem" size="sm" onClick={changeHandler}>
               {show ? "Hide" : "Show"}
             </Button>
           </InputRightElement>
         </InputGroup>
       </FormControl>
       <FormControl id="password" isRequired>
         <FormLabel>Confirm Password</FormLabel>
         <InputGroup size="md">
           <Input
             type={show ? "text" : "password"}
             placeholder="Confirm password"
             onChange={(e) => setConfirmpassword(e.target.value)}
           />
           <InputRightElement width="4.5rem">
             <Button h="1.75rem" size="sm" onClick={changeHandler}>
               {show ? "Hide" : "Show"}
             </Button>
           </InputRightElement>
         </InputGroup>
       </FormControl>
       <FormControl id="pic">
         <FormLabel>Upload your Picture</FormLabel>
         <Input
           type="file"
           p={1.5}
           accept="image/*"
           onChange={(e) => postDetails(e.target.files[0])}
         />
       </FormControl>
       <Button
         colorScheme="blue"
         width="100%"
         style={{ marginTop: 15 }}
         onClick={submitHandler}
         isLoading={picLoading}
       >
         Sign Up
       </Button>
     </VStack>
   );
 }
 