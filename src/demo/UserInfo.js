import React, {useState, useEffect} from "react"
import * as fcl from "@onflow/fcl"

import Card from '../components/Card'
import Header from '../components/Header'
import Result from '../components/Result'

const UserInfo = () => {
  const [user, setUser] = useState(null)

  useEffect(() =>
    fcl
      .currentUser()
      .subscribe(user => setUser({...user}))
  , [])

  return (
    <Card>
      <Header>User information</Header>
      
      {user && <Result>{JSON.stringify(user, null, 2)}</Result>}
    </Card>
  )
}

export default UserInfo
