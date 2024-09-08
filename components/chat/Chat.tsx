'use client';

import React from 'react';
import * as Ably from 'ably';
import { AblyProvider, ChannelProvider } from 'ably/react';
import ChatBox from './ChatBox';

export default function Chat() {
  // Properly type the Ably client
  const client = new Ably.Realtime({ authUrl: '/api' });

  return (
    <AblyProvider client={client}>
      <ChannelProvider channelName="chat-demo">
        <ChatBox />
      </ChannelProvider>
    </AblyProvider>
  );
}
