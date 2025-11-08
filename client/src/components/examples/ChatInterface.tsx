import ChatInterface from '../ChatInterface';

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
    user: 'You',
    content: 'I added it to my target list. Thanks for the heads up!',
    timestamp: new Date(Date.now() - 60000),
    isCurrentUser: true
  }
];

export default function ChatInterfaceExample() {
  return (
    <div className="p-4 h-96">
      <ChatInterface 
        channelName="VV100 Discussion"
        messages={mockMessages}
        onSendMessage={(msg) => console.log('Message sent:', msg)}
      />
    </div>
  );
}
