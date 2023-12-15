// ----------------------------------------------------------------------

import firebase from 'firebase/firestore';

export type ILeadProfile = {
  name: string;
  email: string;
  id: string;
  lastActivity: firebase.Timestamp;
  lastMessage: string;
  phone: string | number;
  profilePic: string;
  unreadCount: number;
  isNomanActive: boolean;
  totalMessageCount: number;
  avgResponseTime: number;
  requiresFollowUp: boolean;
  qualityScore: string;
  conversationSummary: string;
  isWhatsappActive: boolean;
  leadStatus?: string;
}

export type IChatAttachment = {
  name: string;
  size: number;
  type: string;
  path: string;
  preview: string;
  dateCreated: Date;
  dateModified: Date;
};

export type IChatTextMessage = {
  userId: string;
  id?: string;
  leadPhoneNumber: string;
  message: string;
  read: boolean;
  sender: string;
  timestamp: firebase.Timestamp | Date;
  type: 'text' | 'image' | 'sticker' | 'gif' | 'video' | 'audio' | 'document' | 'error';
  caption?: string;
  teamMemberName?: string;
};

export type IChatImageMessage = {
  id: string;
  body: string;
  contentType: 'image';
  attachments: IChatAttachment[];
  createdAt: Date;
  senderId: string;
};

export type IChatMessage = IChatTextMessage | IChatImageMessage;

// ----------------------------------------------------------------------

export type IChatContact = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  address: string;
  phone: string;
  email: string;
  lastActivity: Date | string | number;
  status: string;
  role: string;
};

export type IChatParticipant = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  address?: string;
  phone?: string;
  email?: string;
  lastActivity?: Date | string | number;
  status?: 'online' | 'offline' | 'away' | 'busy';
  role?: string;
};

export type IChatConversation = {
  id: string;
  participants: IChatParticipant[];
  type: string;
  unreadCount: number;
  messages: IChatMessage[];
};

export type IChatSendMessage = {
  conversationId: string;
  messageId: string;
  message: string;
  contentType: 'text';
  attachments: string[];
  createdAt: Date | string | number;
  senderId: string;
};

// ----------------------------------------------------------------------

export type IChatContactsState = {
  byId: Record<string, IChatParticipant>;
  allIds: string[];
};

export type IChatConversationsState = {
  byId: Record<string, IChatConversation>;
  allIds: string[];
};

export type IChatState = {
  isLoading: boolean;
  error: Error | string | null;
  contacts: IChatContactsState;
  conversations: IChatConversationsState;
  activeConversationId: null | string;
  participants: IChatParticipant[];
  recipients: IChatParticipant[];
};

export type IConversationsSummaryData = {
  id: string;
  profilePic: string;
  name: string;
  lastActivity: firebase.Timestamp;
  qualityScore: number;
  conversationSummary: string;
}