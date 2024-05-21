import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import { BASE_URL } from 'src/utils/api';

const useSocketConnection = (): Socket | null => {
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

  return socket;
};

export default useSocketConnection;
