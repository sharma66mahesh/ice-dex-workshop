import {
  formattedAmount,
  getFormattedDate,
  getTransferFromData,
  getTransferToData,
  getUsersData
} from 'helpers/common';
import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { BigNumber } from 'bignumber.js';

const Stats = () => {
  const [transferFromData, setTransferFromData] = useState([]);
  const [transferToReserve, setTransferToReserve] = useState([]);
  const [tokenSupply, setTokenSupply] = useState({
    sendToken: 0,
    receivedToken: 0
  })

  const [usersData, setUsersData] = useState([]);

  const transferFromQuery = `
  query MyQuery {
    ftTransfers(where: {token: {id_eq: "0x1d03ebb7894b67ec6aa1cccdfd0e3898d069fc11"}, from: {id_eq: "0x6218F77faDcddf600AdDa2bC2b66B54F1c3bC469"}}) {
      amount
      timestamp
      from {
        id
      }
      to {
        id
      }
      token {
        id
      }
    }
  }
`;
  const transferToQuery = `
  query MyQuery {
    ftTransfers(where: {token: {id_eq: "0x1d03ebb7894b67ec6aa1cccdfd0e3898d069fc11"}, to: {id_eq: "0x6218F77faDcddf600AdDa2bC2b66B54F1c3bC469"}}) {
      amount
      timestamp
      from {
        id
      }
      to {
        id
      }
      token {
        id
      }
    }
  }
`;

const usersQuery = `
query MyQuery {
  accountFTokenBalances(where: {token: {id_eq: "0x1d03ebb7894b67ec6aa1cccdfd0e3898d069fc11"}, AND: {id_not_contains: "0x6218F77faDcddf600AdDa2bC2b66B54F1c3bC469", id_not_startsWith: "0x0000000000000000000000000000000000000000"}}) {
    amount
    id
  }
}  

`


  useEffect(() => {
    getTransferFromData(transferFromQuery, setTransferFromData, setTokenSupply);
    getTransferToData(transferToQuery, setTransferToReserve, setTokenSupply);
    getUsersData(usersQuery,setUsersData)
  }, []);  

 
  return (
    <div className='chart-container'>
      <h2>Token Supply Graph</h2>
      <div className='chart'>
        {/* Transfer token to reserve */}
        {transferToReserve.length !== 0 && (
          <LineChart
            width={500}
            height={300}
            data={transferToReserve}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type='monotone'
              dataKey='To_Reserve'
              stroke='#d12b34'
              activeDot={{ r: 8 }}
            />
            {/* <Line type='monotone' dataKey='ICZ' stroke='#82ca9d' /> */}
          </LineChart>
        )}

        {/* Transfer token from reserve */}

        {transferFromData.length !== 0 && (
          <LineChart
            width={500}
            height={300}
            data={transferFromData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type='monotone'
              dataKey='From_Reserve'
              stroke='#8884d8'
              activeDot={{ r: 8 }}
            />
            {/* <Line type='monotone' dataKey='ICZ' stroke='#82ca9d' /> */}
          </LineChart>
        )}
      </div>
      
      <div className="token-supply">
        <p>
          <strong>Total Supplied Token to Reserve:</strong>
          {formattedAmount(tokenSupply?.receivedToken)}
        </p>
        <p>
          <strong>Total Transfer Token from Reserve:</strong>
          {formattedAmount(tokenSupply?.sendToken)}
        </p>
        
        <p>
          <strong>
            Current Balance of Token in Reserve:
          </strong>
          {formattedAmount(new BigNumber(tokenSupply?.receivedToken).minus(tokenSupply?.sendToken))}
        </p>
      </div>

      <div className="users-table">
        <h2>Token Owners</h2>
      <table>
        <thead>
          <tr>
            <th>Address</th>
            <th>Tokens</th>
          </tr>
        </thead>
        <tbody>
          {usersData?.map((item, idx) => (
            <tr key={item?.address}>
              <td>
                <a target={'_blank'} rel="noreferrer" href={`https://arctic.epirus.io/accounts/${item?.address}`}>
                  {item?.address}
                </a>
              </td>
              <td>{item?.amount}</td>
            </tr>
          ))}
          
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default Stats;
