 import React, { useState } from 'react'
 import { VStack } from "@chakra-ui/layout";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Button } from '@chakra-ui/react';
import { useToast } from "@chakra-ui/toast";

import axios from "axios";
import { useNavigate } from 'react-router-dom';
 export const Login = () => {
         const toast = useToast();
       const [email,setEmail]= useState();
        const [password,setPassword]= useState();
        const [show,setShow]= useState();
        const [loading, setLoading] = useState();
        const navigate=useNavigate();

      
        const submitHandler = async ()=>{
     setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      // setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate('/chats');
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };


        function changeHandler(){
         if(show){
        setShow(false);
      }
      else{
        setShow(true);
      }
   
     }

   return (
     <VStack spacing="10px">
       <FormControl id="email" isRequired>
         <FormLabel>Email Address</FormLabel>
         <Input
           value={email}
           type="email"
           placeholder="Enter Your Email Address"
           onChange={(e) => setEmail(e.target.value)}
         />
       </FormControl>

       <FormControl id="password" isRequired>
         <FormLabel>Password</FormLabel>
         <InputGroup size="md">
           <Input
           value={password}
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
       <Button
         colorScheme="blue"
         width="100%"
         style={{ marginTop: 15 }}
         onClick={submitHandler}
         isLoading={loading}
       >
         Login
       </Button>

       <Button
         colorScheme="red"
         width="100%"
         style={{ marginTop: 15 }}
         onClick={() => {
           setEmail("guest@example.com");
           setPassword("123456");
         }}
       >
         Get Guest User Crendential
       </Button>
     </VStack>
   );
 }
