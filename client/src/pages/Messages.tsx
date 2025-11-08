import ChatInterface from "@/components/ChatInterface";

const mockMessages = [
  {
    id: '1',
    user: 'John Doe',
    content: 'Anyone watching 2330? Looks like it crossed MA10!',
    timestamp: new Date(Date.now() - 300000)
  },
  {
    id: '2',
    user: 'Jane Smith',
    content: 'Yes! Phase A2 confirmed. Volume is picking up.',
    timestamp: new Date(Date.now() - 180000)
  },
  {
    id: '3',
    user: 'Mike Chen',
    content: 'Added to my watchlist. SAR count is at 5 now.',
    timestamp: new Date(Date.now() - 120000)
  },
  {
    id: '4',
    user: 'You',
    content: 'Thanks for the heads up! I added it to my target list.',
    timestamp: new Date(Date.now() - 60000),
    isCurrentUser: true
  }
];

export default function Messages() {
  return (
    <div className="h-full flex flex-col px-6 py-4">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold" data-testid="heading-messages">Messages</h1>
        <p className="text-sm text-muted-foreground">
          Real-time trading discussions
        </p>
      </div>
      <div className="flex-1">
        <ChatInterface 
          channelName="VV100 Discussion"
          messages={mockMessages}
          onSendMessage={(msg) => console.log('Message sent:', msg)}
        />
      </div>
    </div>
  );
}
