import React, { useState } from 'react';
import { MessageCircle, X, Send, Globe } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('en'); // en, hi, gu
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { text: "Hello! I am your FarmWise AI assistant. 🌾", sender: 'bot' }
  ]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const newMessages = [...messages, { text: input, sender: 'user' }];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await fetch('http://127.0.0.1:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, language: language })
      });
      const data = await response.json();
      
      // Add bot reply
      setMessages([...newMessages, { text: data.reply, sender: 'bot' }]);
    } catch (error) {
      setMessages([...newMessages, { text: "Connection error.", sender: 'bot' }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <Button onClick={() => setIsOpen(true)} className="rounded-full w-14 h-14 bg-green-600 hover:bg-green-700 shadow-xl flex items-center justify-center">
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
      )}

      {isOpen && (
        <Card className="w-80 md:w-96 shadow-2xl flex flex-col h-[500px]">
          <CardHeader className="bg-green-600 text-white rounded-t-lg p-4 flex flex-row justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageCircle className="w-5 h-5" /> FarmWise AI
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-green-700">
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          
          {/* Language Selector */}
          <div className="bg-green-50 p-2 flex justify-center gap-2 border-b">
            <Globe className="w-4 h-4 mt-1 text-green-700" />
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="text-sm bg-transparent border-none text-green-800 font-medium outline-none cursor-pointer">
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="gu">ગુજરાતી (Gujarati)</option>
            </select>
          </div>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm ${msg.sender === 'user' ? 'bg-green-600 text-white rounded-br-none' : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </CardContent>

          <CardFooter className="p-3 bg-white border-t">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex w-full gap-2">
              <Input placeholder="Type a message..." value={input} onChange={(e) => setInput(e.target.value)} className="flex-1" />
              <Button type="submit" size="icon" className="bg-green-600 hover:bg-green-700">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}