import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import { BASE_URL } from 'src/utils/api';

export const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
    return useContext(SocketContext)
}

const SocketProvider = ({children}:{children: React.ReactNode}) => {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (session) {
      const newSocket = io(`${BASE_URL}/user-namespace`, {
        auth: {
          token: session.user._id,
        },
      });
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [session]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
};

export default SocketProvider;
