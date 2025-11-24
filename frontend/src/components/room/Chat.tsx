
import React from 'react';

interface ChatMessage {
  sender: string;
  content: string;
  type: 'CHAT' | 'JOIN' | 'LEAVE';
}

interface ChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
}

const Chat: React.FC<ChatProps> = ({ messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = React.useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white/5 rounded-xl border border-white/10 p-4">
      <h3 className="text-white font-light mb-4">Chat</h3>
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="text-sm">
            {msg.type === 'JOIN' || msg.type === 'LEAVE' ? (
              <p className="text-gray-400 italic">{msg.sender} {msg.content}</p>
            ) : (
              <p><span className="font-medium text-white">{msg.sender}:</span> <span className="text-gray-200">{msg.content}</span></p>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white/80 text-sm"
        />
        <button
          type="button"
          onClick={handleSendMessage}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
