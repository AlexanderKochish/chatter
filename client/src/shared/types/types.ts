export type Profile = {
  bgImage?: File | string | null;
  avatar?: File | string | null;
  bio: string;
  userId: string;
  id: string;
};

export type User = {
  email: string;
  name: string;
  id: string;
  profile: Profile;
};

export type Image = {
  id: string;
  messageId: string;
  url: string;
};
export type Message = {
  id: string;
  text: string;

  createdAt: string;
  updatedAt: string;
  edited: boolean;

  images?: Image[];

  roomId: string;
  ownerId: string;
};

export type MessageForm = Pick<
  Message,
  "images" | "text" | "roomId" | "ownerId"
> & { editMessage?: string };

export type Members = {
  isBanned: boolean;
  isMuted: boolean;
  joinedAt: string;
  role: string;
  roomId: string;

  user: User;
  userId: string;
};

export type ChatRoomResponse = {
  createdAt: string;
  createdById: string;
  id: string;
  isGroup: boolean;
  members: Members[];
  messages: Message[];
  name: string | null;
};

export type MessageImage = {
  id: string;
  url: string;
  messageId: string;
};

export type AllChatImagesResponse = {
  createdAt: string;
  createdById: string;
  id: string;
  isGroup: boolean;
  messages: MessageImage[];
  name: string | null;
};

export type UpdateProfile = Partial<Profile>;

export type CreateNewChat = {
  targetUserId: string;
  currentUserId: string;
};
