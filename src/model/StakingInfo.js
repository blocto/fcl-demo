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
    this.totalStakers = totalStakers
    this.rewardsForNextEpoch = epochTokenPayout
    this.totalStaked = totalStaked
    this.totalCommitted = totalCommitted
    this.totalUnstaked = totalUnstaked
    this.totalRewarded = totalRewarded
    this.totalRequestedToUnstake = totalRequestedToUnstake
  }
}

export default StakingInfo;
