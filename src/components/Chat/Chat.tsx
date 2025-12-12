import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { sendMessage, fetchMessages } from '@/features/chat/chatSlice';
import { selectUser } from '@/features/auth/authSelectors';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import styles from './Chat.module.scss';

interface ChatProps {
  conversationId: number;
  recipientName: string;
}

export const Chat: React.FC<ChatProps> = ({ conversationId, recipientName }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const messages = useAppSelector(
    (state) => state.chat.messages[conversationId] || []
  );

  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchMessages(conversationId));
  }, [conversationId, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageText.trim() || !user) return;

    await dispatch(
      sendMessage({
        conversationId,
        text: messageText,
        senderId: user.id,
        senderName: user.name,
      })
    );

    setMessageText('');
  };

  return (
    <div className={styles.chat}>
      <div className={styles.chatHeader}>
        <h3 className={styles.chatTitle}>Чат с {recipientName}</h3>
        <p className={styles.chatSubtitle}>
          Общайтесь напрямую с репетитором
        </p>
      </div>

      <div className={styles.messages}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>💬</div>
            <p className={styles.emptyText}>
              Пока нет сообщений. Начните общение!
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.message} ${
                message.senderId === user?.id
                  ? styles.messageOwn
                  : styles.messageOther
              }`}
            >
              <div className={styles.messageHeader}>
                <span className={styles.messageSender}>
                  {message.senderName}
                </span>
                <span className={styles.messageTime}>
                  {new Date(message.timestamp).toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div className={styles.messageText}>{message.text}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className={styles.messageForm}>
        <Input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Напишите сообщение..."
          className={styles.messageInput}
        />
        <Button
          type="submit"
          variant="primary"
          disabled={!messageText.trim()}
          className={styles.sendButton}
        >
          Отправить
        </Button>
      </form>
    </div>
  );
};

