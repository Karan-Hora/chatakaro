import React from 'react'
import { Container,Box, Text } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { Login } from '../components/Authentication/Login';
import {Signup} from '../components/Authentication/Signup'
export const Home = () => {
  return (
   
    <Container maxW='xl' centerContent>
   
   <Box display={"flex"} justifyContent={"center"} bg={"white"} w={"100%"} p={3} m={'40px 0 15px 0'} borderRadius="lg"
        borderWidth="1px"  >
   <Text fontSize="4xl" fontFamily="Work sans"> Chat Karo</Text>
   
   </Box>

   <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
<Tabs variant='soft-rounded' colorScheme='green'>
  <TabList>
    <Tab w={'50%'}>Login</Tab>
    <Tab w={'50%'}>Sign Up</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
     <Login/>
    </TabPanel>
    <TabPanel>
      <Signup/>
    </TabPanel>
  </TabPanels>
</Tabs>

   </Box>

    </Container>
  )
}
