import BigNumber from "bignumber.js";

export const formattedAmount = (amount) => {
    console.log(amount)

    const amountInBN = new BigNumber(amount);
    console.log(amountInBN)
  
    // divide by 10**18
    const denominatedAmt = amountInBN.dividedBy(Math.pow(10, 18));
    console.log(denominatedAmt.toFixed(2))
  
    return denominatedAmt.toFixed(2);
}

export const getFormattedDate = (timestamp) => {
    const date = new Date(Number(timestamp));
    console.log(timestamp)
    const formattedDate = date.getDate()+ "/"+(date.getMonth()+1)+ "/"+date.getFullYear()
    return formattedDate
}

export const getTransferFromData = async (query, setData, setToken) => {
    const response = await fetch('http://localhost:4350/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query  }),
    });

    const result = await response.json();
    const data = result.data.ftTransfers;
    console.log(data);
    const formattedData = data.map((item) => {
      let obj = {
        name: getFormattedDate(item.timestamp),
        From_Reserve: formattedAmount(item.amount),
      };
      return obj;
    });

    console.log(formattedData);
    setData(formattedData);
    const fromToken = data.reduce((prev,curr) => prev.plus(curr.amount), new BigNumber(0))
    setToken(prev => {
        return {...prev, sendToken: fromToken}
    })
  };

  export const getTransferToData = async (query, setData, setToken) => {
    const response = await fetch('http://localhost:4350/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query  }),
    });

    const result = await response.json();
    const data = result.data.ftTransfers;
    console.log(data);
    const formattedData = data.map((item) => {
      let obj = {
        name: getFormattedDate(item.timestamp),
        To_Reserve: formattedAmount(item.amount),
      };
      return obj;
    });

    console.log(formattedData);
    setData(formattedData);

    const toToken = data.reduce((prev,curr) => prev.plus(curr.amount), new BigNumber(0))
    setToken(prev => {
        return {...prev, receivedToken: toToken}
    })
  };


  export const getUsersData = async (query, setData) => {
    const response = await fetch('http://localhost:4350/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query  }),
    });

    const result = await response.json();
    const data = result.data.accountFTokenBalances;

    const formattedData = data.map((item) => {
        let obj = {
          address: item.id.split('-')[0],
          amount: formattedAmount(item.amount),
        };
        return obj;
      });
  
    console.log(formattedData);
    setData(formattedData);
  };
  
