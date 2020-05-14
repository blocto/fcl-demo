import React, {useState, useEffect} from "react"
import styled from "styled-components"
import * as fcl from "@onflow/fcl"

import Card from './Card'

const Img = styled.img`
  width: 35px;
  height: 35px;
`
const Name = styled.div``
const Button = styled.button``

const SignInButton = ({ user }) => {
  if (user == null) return null
  if (user.loggedIn) return null

  return <Button onClick={fcl.authenticate}>Sign In/Up</Button>
}

const UserProfile = ({ user }) => {
  if (user == null) return null
  if (!user.loggedIn) return null

  return (
    <>
      {user.identity.avatar && <Img src={user.identity.avatar} />}
      <Name>{user.identity.name || "Anonymous"}</Name>
      <Button onClick={fcl.unauthenticate}>Sign Out</Button>
    </>
  )
}

const CurrentUser = () => {
  const [user, setUser] = useState(null)

  useEffect(() => fcl.currentUser().subscribe(user => setUser({...user})), [])

  return (
    <Card>
      <SignInButton user={user} />
      <UserProfile user={user} />
    </Card>
  )
}

export default CurrentUser
