class StakingInfo {
  constructor({
    totalStakers,
    epochTokenPayout,
    totalStaked,
    totalCommitted,
    totalUnstaked,
    totalRewarded,
    totalRequestedToUnstake,
  }) {
    this.totalStakers = Number(totalStakers)
    this.rewardsForNextEpoch = Number(epochTokenPayout)
    this.totalStaked = Number(totalStaked)
    this.totalCommitted = Number(totalCommitted)
    this.totalUnstaked = Number(totalUnstaked)
    this.totalRewarded = Number(totalRewarded)
    this.totalRequestedToUnstake = Number(totalRequestedToUnstake)
  }
}

export default StakingInfo;
