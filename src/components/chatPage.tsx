import { useState, useEffect, useRef } from "react";
import { Send, Star, Calendar, MapPin, MessageSquare, Plus, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import NavBar from "./navBar";
import { useNavigate, useParams } from "react-router-dom";
import { db, type BirthDetail, type Chat } from "../../db";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

function chatMessage(message: { role: string; content: string }) {
  return (
    <div className={`max-w-[85%] rounded-xl p-4 shadow-lg ${
        message.role === "user" 
          ? "bg-white text-black border-2 border-gray-200" 
          : "bg-gradient-to-br from-gray-900 to-black text-white border border-gray-700"
      } break-words overflow-hidden whitespace-pre-wrap`}
    >
      {message.role === "assistant" && (
        <div className="flex items-center gap-2 mb-2 text-gray-400">
          <Sparkles size={16} />
          <span className="text-xs font-medium">Cosmic AI</span>
        </div>
      )}
      <div className="prose prose-sm prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          key={message.content}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  )
};

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "🌟 **Namaste! I'm your AI Astrologer.** \n\nI'm here to help you understand your cosmic journey and unlock the secrets written in the stars. How can I illuminate your path today?" }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { birthDetailId } = useParams<{ birthDetailId: string }>();
  var { chatId } = useParams<{ chatId: string }>();
  const [birthDetail, setBirthDetail] = useState<BirthDetail | null>(null);
  const [prevChats, setPrevChats] = useState<Chat[]>([]);
  const navigate = useNavigate();
  const [currentChatId, setCurrentChatId] = useState(chatId ?? null);

  // Function to adjust textarea height
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 150) + "px";
    }
  };

  useEffect(() => {
    const fetchBirthDetail = async () => {
      if (birthDetailId) {
        try {
          const detail = await db.BirthDetails.get(Number(birthDetailId));
          setBirthDetail(detail ?? null);

          const chats = await db.Chats.where("birthDetailId").equals(Number(birthDetailId)).toArray();
          setPrevChats(chats);

          if(currentChatId) {
            const chat = await db.Chats.get(Number(chatId));
            if (chat) {
              const messages = await db.Messages.where("chat_id").equals(chat.id).toArray();
              setMessages(messages.map(msg => ({ role: msg.role, content: msg.content })));
            }
          }
        } catch (error) {
          console.error("Error fetching birth detail:", error);
        }
      }
    };

    fetchBirthDetail();
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputMessage]);

  useEffect(() => {
    if (!currentChatId) return;

    const fetchMessages = async () => {
      const chatMessages = await db.Messages.where("chat_id").equals(Number(currentChatId)).toArray();
      console.log("Fetched messages:", chatMessages);
      if (chatMessages.length > 0) {
        setMessages(chatMessages.map(msg => ({ role: msg.role, content: msg.content })));
      }
    };

    fetchMessages();
  }, [currentChatId]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "" || isLoading) return;

    setIsLoading(true);
    const userMessage = { role: "user", content: inputMessage };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages.concat({ role: "assistant", content: "" }));
    setInputMessage("");

    if (!currentChatId) {
      const newChat = await db.Chats.add({
        birthDetailId: Number(birthDetailId),
        timestamp: new Date(),
      });
      setCurrentChatId(newChat.toString());
      navigate(`/chat/${birthDetailId}/${newChat}`, { replace: true });
      setPrevChats((prev) => [
        ...prev,
        { id: newChat, birthDetailId: Number(birthDetailId), timestamp: new Date() },
      ]);
    }

    await db.Messages.add({
      chat_id: Number(currentChatId),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    });

    try {
      const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
      const response = await fetch(`${url}/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          birthDetail: {
            name: birthDetail?.name,
            birthDateTime: birthDetail?.birthDateTime,
            birthPlace: birthDetail?.birthPlace,
            latitude: birthDetail?.latitude,
            longitude: birthDetail?.longitude,
          },
          sessionId: birthDetail?.session_id,
        }),
      });

      if (!response.body) {
        console.error("No response body from the server.");
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let assistantReply = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        assistantReply += chunk;

        setMessages((prev) => {
          if (prev.length === 0) return prev;
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: assistantReply,
          };
          return updated;
        });
      }

      await db.Messages.add({
        chat_id: Number(currentChatId),
        role: "assistant",
        content: assistantReply,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "✨ Tell me about my birth chart",
    "💕 What about my future life partner?",
    "🔮 What does my future look like?",
    "🤝 How can I improve my relationships?",
    "🎯 What career path should I consider?",
    "⚡ What are my strengths and weaknesses?",
    "🎨 How can I enhance my creativity?",
  ];

  return (
    <div className="h-screen w-full flex flex-col bg-black">
      <NavBar />
      
      {/* Mobile menu button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-1/2 transform -translate-y-1/2 z-50 bg-black/5 border border-gray-600 hover:border-white rounded-lg pr-3 pb-3 pt-3 pl-1 shadow-2xl transition-all duration-300"
      >
        {isSidebarOpen ? <ChevronRight size={20} className="text-white" /> : <ChevronLeft size={20} className="text-white" />}
      </button>

      <div className="flex-1 w-full h-full flex md:px-8 py-6 px-4 gap-6 overflow-hidden scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-gray-700">
        {/* Left Sidebar */}
        <div className={`w-full md:w-96 h-full flex flex-col bg-gradient-to-b from-gray-900 to-black border border-gray-700 rounded-xl 
                        p-6 shadow-2xl transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'inset-0 z-40 md:relative md:inset-auto translate-x-0' : 'fixed inset-0 z-40 md:relative md:inset-auto -translate-x-full md:translate-x-0 md:flex hidden'}`}>
          
          {/* Profile Header */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-black rounded-lg border border-gray-700">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
              <Star className="text-white" size={20} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-1">{birthDetail?.name}</h2>
              <p className="text-gray-400 text-sm">Cosmic Profile</p>
            </div>
          </div>

          {/* Birth Details */}
          <div className="mb-6 p-4 bg-black rounded-lg border border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="text-gray-400" size={16} />
              <span className="text-gray-300 font-medium text-sm">Birth Details</span>
            </div>
            <div className="space-y-2 text-xs">
              <p className="text-gray-300">
                {birthDetail?.birthDateTime.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })} at {birthDetail?.birthDateTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
              <div className="flex items-center gap-1">
                <MapPin size={12} className="text-gray-400" />
                <p className="text-gray-400">{birthDetail?.birthPlace}</p>
              </div>
            </div>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <MessageSquare size={16} />
              Chat History
            </h3>
            
            <div className="space-y-3">
              {/* New Chat Button */}
              <button 
                className="w-full flex items-center gap-3 p-3 bg-white text-black rounded-lg font-medium hover:bg-black hover:text-white border-2 border-white hover:border-gray-300 transition-all duration-300 transform hover:scale-105" 
                onClick={() => { 
                  navigate(`/chat/${birthDetailId}`); 
                  setCurrentChatId(null); 
                  setIsSidebarOpen(false);
                  setMessages([{ role: "assistant", content: "🌟 **Namaste! I'm your AI Astrologer.** \n\nI'm here to help you understand your cosmic journey and unlock the secrets written in the stars. How can I illuminate your path today?" }]);
                }}
              >
                <Plus size={16} />
                <span>New Cosmic Chat</span>
              </button>

              {/* Previous Chats */}
              {[...prevChats].reverse().map((chat) => (
                <button 
                  key={chat.id} 
                  className={`w-full flex flex-col items-start gap-1 p-3 rounded-lg border transition-all duration-300 hover:scale-105 ${
                    currentChatId === chat.id.toString() 
                      ? 'bg-gray-700 border-gray-500 text-white' 
                      : 'bg-transparent border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-800'
                  }`}
                  onClick={() => { 
                    navigate(`/chat/${chat.birthDetailId}/${chat.id}`); 
                    setCurrentChatId(chat.id.toString()); 
                    setIsSidebarOpen(false); 
                  }}
                >
                  <span className="font-medium text-sm">Chat Session</span>
                  <span className="text-xs text-gray-400">
                    {new Date(chat.timestamp).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && <div className="md:hidden fixed inset-0 bg-black bg-opacity-75 z-30" onClick={() => setIsSidebarOpen(false)} />}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-900 to-black border border-gray-700 rounded-xl shadow-2xl relative h-full overflow-hidden">
          
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-black rounded-t-xl ">
            <div className="flex items-center gap-3">
              <Sparkles className="text-white" size={20} />
              <h1 className="text-white font-bold text-lg">
                Cosmic <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Chat</span>
              </h1>
            </div>
            <div className="text-gray-400 text-sm">
              {messages.length > 1 ? `${messages.length - 1} messages` : 'New conversation'}
            </div>
          </div>
          
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-gray-700">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {chatMessage(message)}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-xl p-4 bg-gradient-to-br from-gray-900 to-black text-white border border-gray-700">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-gray-400 animate-pulse" />
                    <span className="text-gray-400 animate-pulse">Consulting the cosmos...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message Input */}
          <div className="p-6 border-t border-gray-700 bg-black rounded-b-xl">
            {/* Suggestions */}
            <div className="mb-4 overflow-x-auto scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-gray-700">
              <div className="flex gap-3 pb-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="flex-shrink-0 text-sm border border-gray-600 rounded-lg px-4 py-2 bg-transparent text-gray-300 cursor-pointer hover:bg-white hover:text-black hover:border-white transition-all duration-300 whitespace-nowrap transform hover:scale-105"
                    onClick={() => setInputMessage(suggestion.replace(/^[^\s]+\s/, ''))}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Input Area */}
            <div className="flex-2 flex gap-3 items-center">
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask about your cosmic destiny..."
                  className="w-full bg-gray-900 text-white p-4 rounded-xl border border-gray-600 
                            focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20 
                            resize-none transition-all duration-300 scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-gray-700"
                  rows={1}
                  ref={textareaRef}
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={inputMessage.trim() === "" || isLoading}
                className={`h-12 w-12 bg-white hover:bg-black text-black hover:text-white p-3 rounded-xl transition-all duration-300 border-2 border-white hover:border-gray-300 transform hover:scale-105 shadow-lg ${
                  (inputMessage.trim() === "" || isLoading) ? "opacity-50 cursor-not-allowed transform-none" : ""
                }`}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}