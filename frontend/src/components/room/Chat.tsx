
import React from 'react';

interface ChatMessage {
  sender: string;
  content: string;
  type: 'CHAT' | 'JOIN' | 'LEAVE' | 'REACTION';
}

interface ChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onSendReaction: (emoji: string) => void;
}

const Chat: React.FC<ChatProps> = ({ messages, onSendMessage, onSendReaction }) => {
  const [newMessage, setNewMessage] = React.useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 max-h-[400px]">
      <h3 className="text-white font-semibold mb-3 text-sm">Chat</h3>

      <div className="flex-1 overflow-y-auto mb-3 space-y-2 pr-2 max-h-[250px]">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`text-xs ${msg.type === 'CHAT'
                ? 'text-white/90'
                : 'text-white/50 italic text-center'
              }`}
          >
            {msg.type === 'CHAT' ? (
              <>
                <span className="font-semibold text-red-400">{msg.sender}:</span>{' '}
                {msg.content}
              </>
            ) : msg.type === 'JOIN' ? (
              `${msg.sender} joined the room`
            ) : (
              `${msg.sender} left the room`
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2 mb-2">
        {['🔥', '😂', '❤️', '😮', '👏'].map((emoji) => (
          <button
            key={emoji}
            onClick={() => onSendReaction(emoji)}
            className="text-lg hover:scale-125 transition-transform"
          >
            {emoji}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-2 py-1.5 text-white/80 text-xs"
        />
        <button
          type="button"
          onClick={handleSendMessage}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
