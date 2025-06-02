import { ReactNode, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SocketContext } from "./context";
import Spinner from "../ui/Spinner/Spinner";
const URL = "http://localhost:3000";
type Props = {
  children: ReactNode;
  userId: string;
};

export const SocketProvider = ({ children, userId }: Props) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;
    const socketInstace = io(URL, {
      auth: { userId },
    });

    setSocket(socketInstace);

    return () => {
      socketInstace.disconnect();
    };
  }, [userId]);

  if (!socket) {
    return <Spinner />;
  }
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
