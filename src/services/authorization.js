import * as fcl from "@onflow/fcl"

const authorization = async (account = {}) => {
    const addr = '048b8110f4e26dfe';
    const keyId = 0;

    const { account: user } = await fcl.send([fcl.getAccount(addr)]);

    const key = user.keys[keyId];
    let sequenceNum;
    if (account.role.proposer) sequenceNum = key.sequenceNumber;

    const signingFunction = async data => {
        const signature = await fetch(
            `https://flow-wallet-testnet.blocto.app/api/flow/starly-sign`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data,
                })
            }
        )
            .then(response => response.json())
            .then(response => response.signature)

        return ({
            addr,
            keyId: key.index,
            signature,
        });
    };

    return {
        ...account,
        addr,
        keyId: key.index,
        sequenceNum,
        signature: account.signature || null,
        signingFunction,
        resolve: null,
        roles: account.roles,
    };
};

export default authorization
