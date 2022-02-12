import { cartActions } from "./cart-slice";
import React,{useState} from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { DeFiWeb3Connector } from "deficonnect";
import WalletConnectProvider from "@walletconnect/web3-provider";

export const update = () => {
  const manualWeb3cronosTestNet = new Web3(new Web3.providers.HttpProvider('https://cronos-testnet-3.crypto.org:8545'))

  return async (dispatch) => {
    detectEthereumProvider()
      .then((provider) => {
        if (provider) {
          const eb3 = new Web3(provider);
          dispatch(cartActions.web(eb3));
          dispatch(cartActions.provider(provider));
          window.ethereum
            .request({
              method: "eth_accounts",
            })
            .then((accounts) => {
              const addr = accounts.length <= 0 ? "" : accounts[0];
              if (accounts.length > 0) {
                dispatch(cartActions.account(addr));
                eb3.eth.getBalance(accounts[0]).then((amount) => {
                  dispatch(cartActions.balance(amount));
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }else{
          dispatch(cartActions.web(manualWeb3cronosTestNet));
          dispatch(cartActions.provider(manualWeb3cronosTestNet));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

////////////////////=<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>

export const connectMetamask = () => {
  return async (dispatch) => {
    const provider = await detectEthereumProvider();
    if (provider) {
      if (!window.ethereum.selectedAddress) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
      }
      await window.ethereum.enable();
      let currentAddress = window.ethereum.selectedAddress;

      const eb3 = new Web3(provider);
      let amount = await eb3.eth.getBalance(currentAddress);
      amount = eb3.utils.fromWei(eb3.utils.toBN(amount), "ether");
      dispatch(
        cartActions.connect({
          web3: eb3,
          account: currentAddress,
          balance: amount,
          wallettype: "MetaMask",
        })
      );
    } else {
      console.log("Please install MetaMask!");
    }
  };
};
////////////////////=<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>
export const connectDefi = () => {
  return async (dispatch) => {
    const connector = new DeFiWeb3Connector({
      supportedChainIds: [1, 338],
      rpc: {
        1: "https://mainnet.infura.io/v3/17e978710e44440cadf40a13e0ebeaff",
        338: "https://cronos-testnet-3.crypto.org:8545",
      },
      pollingInterval: 15000,
    });
    await connector.activate();
    const provider = await connector.getProvider();
    const eb3 = new Web3(provider);
    const address = (await eb3.eth.getAccounts())[0];
    let amount = await eb3.eth.getBalance(address);

    amount = eb3.utils.fromWei(eb3.utils.toBN(amount), "ether");
    dispatch(
      cartActions.connect({
        web3: eb3,
        account: address,
        wallettype: "Defi Wallet",
        balance: amount,
      })
    );
  };
};

///////////////
export const connectEther = async () => {
  const mobileWalletProvider =  new WalletConnectProvider({
    rpc: {
      1:" https://mainnet.infura.io/v3/51a14778daab4573a110aa9a352ac330",
      338: "https://cronos-testnet-3.crypto.org:8545",
      // ...
    },
  });
  await mobileWalletProvider.enable();
  return async (dispatch) => {

    await window.ethereum.enable();
    let currentAddress = window.ethereum.selectedAddress;
 
    const eb3 = new Web3(mobileWalletProvider);
    let amount = await eb3.eth.getBalance(currentAddress);
    amount = eb3.utils.fromWei(eb3.utils.toBN(amount), "ether");
    console.log("connect Ether",eb3)
    dispatch(
      cartActions.connect({
        web3: eb3,
        account: currentAddress,
        balance: amount,
        wallettype: "Wallet Connect",
      })
    );
  
  };

}


export const disconnect = () => {
  return (dispatch) => {
    dispatch(cartActions.disconnect());
  };
};


// if (mobileWalletProvider) {
//   if (!window.ethereum.selectedAddress) {
//     await window.ethereum.request({ method: "eth_requestAccounts" });
//   }

//   let currentAddress = window.ethereum.selectedAddress;

//   const eb3 = new Web3(mobileWalletProvider);
//   let amount = await eb3.eth.getBalance(currentAddress);
//   amount = eb3.utils.fromWei(eb3.utils.toBN(amount), "ether");
//   dispatch(
//     cartActions.connect({
//       web3: eb3,
//       account: currentAddress,
//       balance: amount,
//       wallettype: "Mobile Connect",
//     })
//   );
// } else {
//   console.log("Please install Mobile Connect!");
// }