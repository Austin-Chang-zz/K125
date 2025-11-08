import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Hash } from "lucide-react";

interface Message {
  id: string;
  user: string;
  content: string;
  timestamp: Date;
  isCurrentUser?: boolean;
}

interface ChatInterfaceProps {
  channelName?: string;
  messages?: Message[];
  onSendMessage?: (message: string) => void;
}

export default function ChatInterface({ 
  channelName = "VV100 Discussion",
  messages: initialMessages = [],
  onSendMessage 
}: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const handleSend = () => {
    if (!message.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      user: "You",
      content: message,
      timestamp: new Date(),
      isCurrentUser: true
    };
    
    setMessages([...messages, newMessage]);
    onSendMessage?.(message);
    setMessage("");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="border-b py-3">
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-medium" data-testid="text-channel-name">{channelName}</h3>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm" data-testid="text-no-messages">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex gap-3 ${msg.isCurrentUser ? 'flex-row-reverse' : ''}`}
                  data-testid={`message-${msg.id}`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {getUserInitials(msg.user)}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`flex-1 ${msg.isCurrentUser ? 'text-right' : ''}`}>
                    <div className="flex items-baseline gap-2 mb-1">
                      {!msg.isCurrentUser && (
                        <span className="font-medium text-sm" data-testid={`text-username-${msg.id}`}>
                          {msg.user}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground" data-testid={`text-time-${msg.id}`}>
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    <div 
                      className={`inline-block px-3 py-2 rounded-lg text-sm ${
                        msg.isCurrentUser 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}
                      data-testid={`text-content-${msg.id}`}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        <div className="border-t p-4">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-2"
          >
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              data-testid="input-message"
            />
            <Button type="submit" size="icon" data-testid="button-send">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
