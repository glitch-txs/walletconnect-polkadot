export const evmparams = {
  requiredNamespaces: {
    eip155: {
      methods: [
        "eth_sendTransaction",
        "eth_signTransaction",
      ],
      chains:['eip155:1', 'eip155:56', 'eip155:137'],
      events: ["chainChanged", "accountsChanged"],
      rpcMap: {
        1:'https://eth.llamarpc.com',
        56: 'https://bsc-dataseed.binance.org/',
        137:'https://polygon-rpc.com',
      }
    },
  },
}