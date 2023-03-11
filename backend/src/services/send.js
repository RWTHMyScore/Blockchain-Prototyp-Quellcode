const { getWeb3 } = require("./contracts");

const web3 = getWeb3();

const isIterable =  (value) => {
  return Symbol.iterator in Object(value);
}

const encodeMethod = (methods, func, args) => {
    if(isIterable(args)) {
      return methods[func](...args).encodeABI();
    }
    else {
      return methods[func](args).encodeABI();
    }
}

const sendTransactionToContract = async (from, pk, scontract, func, gas, args) => {
    if(typeof func === 'string') {
      //Encode Method before signing
      var encoded = encodeMethod(scontract.contract.methods, func, args);
      var tx = {
        to : scontract.address,
        from: from,
        gas: gas,
        data : encoded
      }
      return await web3.eth.accounts.signTransaction(tx, pk).then(signed => {
          return web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt', console.log)
      });
    }
    return;
}

module.exports = {
  sendTransactionToContract
}