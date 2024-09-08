import React, { useEffect, useState, useRef } from 'react';
import { useChannel } from 'ably/react';
import styles from './ChatBox.module.css';

export default function ChatBox() {
  // Define types for refs
  const inputBox = useRef<HTMLTextAreaElement | null>(null);
  const messageEnd = useRef<HTMLDivElement | null>(null);

  const [messageText, setMessageText] = useState('');
  const [receivedMessages, setMessages] = useState<any[]>([]); // Adjust the type if you know the exact structure of your messages
  const messageTextIsEmpty = messageText.trim().length === 0;

  const { channel, ably } = useChannel('chat-demo', (message) => {
    const history = receivedMessages.slice(-199);
    setMessages([...history, message]);
  });

  const sendChatMessage = (messageText: string) => {
    channel.publish({ name: 'chat-message', data: messageText });
    setMessageText('');
    inputBox.current?.focus(); // Use ref to focus the input
  };

  const handleFormSubmission = (event: React.FormEvent) => {
    event.preventDefault();
    if (!messageTextIsEmpty) {
      sendChatMessage(messageText);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.charCode === 13 && !messageTextIsEmpty) {
      sendChatMessage(messageText);
      event.preventDefault();
    }
  };

  const messages = receivedMessages.map((message, index) => {
    const author = message.connectionId === ably.connection.id ? 'me' : 'other';
    return (
      <span key={index} className={styles.message} data-author={author}>
        {message.data}
      </span>
    );
  });

  useEffect(() => {
    if (messageEnd.current) {
      messageEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [receivedMessages]);

  return (
    <div className={styles.chatHolder}>
      <div className={styles.chatText}>
        {messages}
        <div ref={messageEnd}></div> {/* Assign ref to messageEnd */}
      </div>
      <form onSubmit={handleFormSubmission} className={styles.form}>
        <textarea
          ref={inputBox} // Assign ref to inputBox
          value={messageText}
          placeholder="Type a message..."
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={handleKeyPress}
          className={styles.textarea}
        ></textarea>
        <button type="submit" className={styles.button} disabled={messageTextIsEmpty}>
          Send
        </button>
      </form>
    </div>
  );
}
