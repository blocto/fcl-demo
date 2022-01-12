import React, { useEffect, useState } from "react"
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

import Card from '../components/Card'
import Code from '../components/Code'
import StakingInfo from '../model/StakingInfo'

const scriptOne = `\
import BloctoTokenStaking from 0x0f9df91c9121c460

pub struct StakingInfo {
  pub let totalStakers: Int
  pub let epochTokenPayout: UFix64
  pub let totalStaked: UFix64
  pub let totalCommitted: UFix64
  pub let totalUnstaked: UFix64
  pub let totalRewarded: UFix64
  pub let totalRequestedToUnstake: UFix64

  init(offset: Int) {
    let stakerIds = BloctoTokenStaking.getStakerIDs()

    self.totalStakers = stakerIds.length
    self.epochTokenPayout = BloctoTokenStaking.getEpochTokenPayout()
    self.totalStaked = BloctoTokenStaking.getTotalStaked()

    var totalCommitted: UFix64 = 0.0
    var totalUnstaked: UFix64 = 0.0
    var totalRewarded: UFix64 = 0.0
    var totalRequestedToUnstake: UFix64 = 0.0
    var index: Int = offset

    while (index < offset + 5000) && index < self.totalStakers {
      let stakerInfo = BloctoTokenStaking.StakerInfo(stakerIds[index])

      totalCommitted = totalCommitted + stakerInfo.tokensCommitted
      totalUnstaked = totalUnstaked + stakerInfo.tokensUnstaked
      totalRewarded = totalRewarded + stakerInfo.tokensRewarded
      totalRequestedToUnstake = totalRequestedToUnstake + stakerInfo.tokensRequestedToUnstake

      index = index + 1
    }

    self.totalCommitted = totalCommitted
    self.totalUnstaked = totalUnstaked
    self.totalRewarded = totalRewarded
    self.totalRequestedToUnstake = totalRequestedToUnstake
  }
}

pub fun main(offset: Int): StakingInfo {
  return StakingInfo(offset: offset)
}
`;

fcl.config()
  .put("decoder.StakingInfo", data => new StakingInfo(data))

export default function ScriptTwo() {
  const [data, setData] = useState({})

  const runScript = async () => {
    let response = await fcl.send([
      fcl.script(scriptOne),
      fcl.args([
        fcl.arg(0, t.Int),
      ]),
    ])

    const response1 = await fcl.decode(response)

    response = await fcl.send([
      fcl.script(scriptOne),
      fcl.args([
        fcl.arg(5000, t.Int),
      ]),
    ])

    const response2 = await fcl.decode(response)

    response = await fcl.send([
      fcl.script(scriptOne),
      fcl.args([
        fcl.arg(10000, t.Int),
      ]),
    ])

    const response3 = await fcl.decode(response)

    const responseFinal = {
      totalStakers: response1.totalStakers,
      epochTokenPayout: response1.epochTokenPayout,
      totalStaked: response1.totalStaked,
      totalCommitted:
        response1.totalCommitted +
        response2.totalCommitted +
        response3.totalCommitted,
      totalUnstaked:
        response1.totalUnstaked +
        response2.totalUnstaked +
        response3.totalUnstaked,
      totalRewarded:
        response1.totalRewarded +
        response2.totalRewarded +
        response3.totalRewarded,
      totalRequestedToUnstake:
        response1.totalRequestedToUnstake +
        response2.totalRequestedToUnstake +
        response3.totalRequestedToUnstake,
    }

    setData(responseFinal)
  }

  useEffect(() => {
    runScript();
  }, [])

  return (
    <Card>
      <Code>
        {JSON.stringify(data, null, 2)}
      </Code>
    </Card>
  )
}
