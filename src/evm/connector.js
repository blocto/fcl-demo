import { BloctoConnector } from '@blocto/blocto-connector';

const EthereumConnector = new BloctoConnector({
  chainId: 4,
  rpc: 'https://rinkeby.infura.io/v3/ef5a5728e2354955b562d2ffa4ae5305'
});

const BscConnector = new BloctoConnector({
  chainId: 97,
});

export { EthereumConnector, BscConnector };