import React, {useState, useEffect} from "react"
import styled from "styled-components"
import * as fcl from "@onflow/fcl"

import Card from '../components/Card'

const Profile = styled.div`
  margin-bottom: 10px;
`
const Img = styled.img`
  width: 50px;
  height: 50px;
`
const Info = styled.div``
const Button = styled.button``

const SignInOutButton = ({ user }) => {
  const isLoggedIn = user && user.loggedIn;

  return (
    <Button onClick={isLoggedIn ? fcl.unauthenticate : fcl.authenticate}>
      {isLoggedIn ? 'Sign Out' : 'Sign In/Up'}
    </Button>
  )
}

const UserProfile = ({ user }) => (
  <Profile>
    {user.identity.avatar && <Img src={user.identity.avatar} />}

    <Info>
      <b>Name</b>: {user.identity.name || "Anonymous"}
    </Info>
    <Info>
      <b>Address</b>: {user.addr || ""}
    </Info>
  </Profile>
)

const CurrentUser = () => {
  const [user, setUser] = useState(null)

  useEffect(() =>
    fcl
      .currentUser()
      .subscribe(user => setUser({...user}))
  , [])

  return (
    <Card>
      {user && user.loggedIn && <UserProfile user={user} />}

      <SignInOutButton user={user} />
    </Card>
  )
}

export default CurrentUser
