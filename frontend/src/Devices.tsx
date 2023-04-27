import React from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const DEVICES_QUERY = gql`
  query Devices {
    devices {
      name
      ipAddress
      macAddress
    }
  }
`;

const AWAKEN_MUTATION = gql`
  mutation Awaken($macAddress: String!) {
    awaken(macAddress: $macAddress)
  }
`;

const Devices: React.FC = () => {
  const { loading, error, data } = useQuery(DEVICES_QUERY, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  });

  const [awaken] = useMutation(AWAKEN_MUTATION, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  });

  const handleWakeUp = (macAddress: string) => {
    awaken({ variables: { macAddress } });
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Devices</h1>
      <button onClick={handleLogout}>Logout</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>IP Address</th>
            <th>MAC Address</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.devices.map((device: any) => (
            <tr key={device.macAddress}>
              <td>{device.name}</td>
              <td>{device.ipAddress}</td>
              <td>{device.macAddress}</td>
              <td>
                <button onClick={() => handleWakeUp(device.macAddress)}>Wake up</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Devices;
