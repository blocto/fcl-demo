import React, { useEffect, useState } from "react"
import * as fcl from "@onflow/fcl"

import Card from '../components/Card'
import Code from '../components/Code'
import StakingInfo from '../model/StakingInfo'

const scriptTwo = `\
import BloctoTokenStaking from 0x0f9df91c9121c460

pub struct StakingInfo {
  pub let totalStakers: Int
  pub let epochTokenPayout: UFix64
  pub let totalStaked: UFix64
  pub let totalCommitted: UFix64
  pub let totalUnstaked: UFix64
  pub let totalRewarded: UFix64
  pub let totalRequestedToUnstake: UFix64

  init() {
    let stakerIds = BloctoTokenStaking.getStakerIDs()

    self.totalStakers = stakerIds.length
    self.epochTokenPayout = BloctoTokenStaking.getEpochTokenPayout()
    self.totalStaked = BloctoTokenStaking.getTotalStaked()

    var totalCommitted: UFix64 = 0.0
    var totalUnstaked: UFix64 = 0.0
    var totalRewarded: UFix64 = 0.0
    var totalRequestedToUnstake: UFix64 = 0.0
    var index: Int = 0

    for stakerId in stakerIds {
      let stakerInfo = BloctoTokenStaking.StakerInfo(stakerId)

      totalCommitted = totalCommitted + stakerInfo.tokensCommitted
      totalUnstaked = totalUnstaked + stakerInfo.tokensUnstaked
      totalRewarded = totalRewarded + stakerInfo.tokensRewarded
      totalRequestedToUnstake = totalRequestedToUnstake + stakerInfo.tokensRequestedToUnstake

      index = index + 1
      if index > 5000 {
        break
      }
    }

    self.totalCommitted = totalCommitted
    self.totalUnstaked = totalUnstaked
    self.totalRewarded = totalRewarded
    self.totalRequestedToUnstake = totalRequestedToUnstake
  }
}

pub fun main(): StakingInfo {
  return StakingInfo()
}
`;

fcl.config()
  .put("decoder.StakingInfo", data => new StakingInfo(data))

export default function ScriptTwo() {
  const [data, setData] = useState(null)

  const runScript = async () => {
    const response = await fcl.send([
      fcl.script(scriptTwo),
    ])

    setData(await fcl.decode(response))
  }

  useEffect(() => {
    runScript()
  }, [])

  return (
    <Card>
      {data && (
        <Code>
          {JSON.stringify(data, null, 2)}
        </Code>
      )}
    </Card>
  )
}
