import React, { useState, useEffect } from 'react';
import './AIChat.css';
import WebsiteNavbar from '../../components/HomePageComponents/WebsiteNavbar';
import Sidebar from '../../components/HomePageComponents/Sidebar';
import { FaMicrophone, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { ImAttachment } from "react-icons/im";
import { BiLike, BiDislike } from 'react-icons/bi';

// Assuming you have an AI avatar image
import aiAvatar from '../../assets/images/Ai-avatar.svg';

function AIChat() {
    const [messages, setMessages] = useState([
        {
            type: "Ai-incoming",
            userId: 1,
            avatar: aiAvatar,
            text: "Hi there! How can I assist you today?",
            content: {
                type: "buttons",
                buttons: [
                    { text: "Plan a trip ✈️", action: "plan_trip" },
                    { text: "Ask general questions 🤔", action: "ask_question" },
                    { text: "Use translation services 🌐", action: "translate" },
                ],
            },
        },
    ]);

    const [inputValue, setInputValue] = useState("");

    // Function to scroll to the bottom of the messages container
    const scrollToBottom = () => {
        const messagesContainer = document.querySelector('.AIchat-messages');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    };

    // Call scrollToBottom whenever messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleButtonClick = (action, buttonText) => {
        const userId = 2; // Assuming the current user has ID 2
        const newMessage = { text: buttonText, type: "Ai-outgoing", userId, status: "sent" };
        setMessages(prevMessages => [...prevMessages, newMessage]);

        // Trigger AI response based on button action
        setTimeout(() => {
            let aiResponse = "";
            switch (action) {
                case "plan_trip":
                    aiResponse = "Hi there! I'd love to help you plan your perfect trip. Let's start with a few quick questions. 😊";
                    setMessages(prevMessages => [
                        ...prevMessages,
                        { text: aiResponse, type: "Ai-incoming", userId: 1, avatar: aiAvatar },
                        {
                            type: "Ai-incoming",
                            userId: 1,
                            avatar: aiAvatar,
                            text: "What’s your budget range for this trip?", // Added text for the next AI message
                            content: {
                                type: "buttons",
                                buttons: [
                                    { text: "In-Budget", action: "budget_in" },
                                    { text: "Mid-Range", action: "budget_mid" },
                                    { text: "Luxury", action: "budget_luxury" },
                                ],
                            },
                        },
                    ]);
                    break;
                case "ask_question":
                    aiResponse = "Great! What general question do you have for me? 🤔";
                    setMessages(prevMessages => [...prevMessages, { text: aiResponse, type: "Ai-incoming", userId: 1, avatar: aiAvatar }]);
                    break;
                case "translate":
                    aiResponse = "Sure, what would you like to translate and to which language? 🌐";
                    setMessages(prevMessages => [...prevMessages, { text: aiResponse, type: "Ai-incoming", userId: 1, avatar: aiAvatar }]);
                    break;
                default:
                    break;
            }
        }, 500);
    };

    const handleSendMessage = () => {
        if (inputValue.trim() !== "") {
            const userId = 2;
            const newMessage = { text: inputValue, type: "Ai-outgoing", userId, status: "sent" };
            const newMessages = [...messages, newMessage];
            setMessages(newMessages);
            setInputValue("");

            // Simulate AI response after user sends a message
            setTimeout(() => {
                const aiResponse = `You said: ${inputValue}`;
                setMessages(prevMessages => [...prevMessages, { text: aiResponse, type: "Ai-incoming", userId: 1, avatar: aiAvatar }]);
            }, 1000);
        }
    };

    return (
        <>
            <WebsiteNavbar />

            <div className="ai-main-conatiner">
            <div className="ai-sidebar">
            <Sidebar />
            </div>
            <div className='AIchat-container'>
                <div className="AIchat-sidebar">
                    <h2>Chats</h2>
                    <input type="text" placeholder="Search here.." className="AIchat-search" />
                    <div className="AIchat-user" key={1} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {aiAvatar && <img src={aiAvatar} alt="AI Assistant" className="AIchat-user-avatar" />}
                        <div>
                            <p className="AIchat-user-name">AI Assistant</p>
                            <p className="AIchat-user-msg-preview">{messages[0]?.text}</p>
                        </div>
                    </div>
                </div>

                <div className="AIchat-content">
                    <div className="AIchat-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src={aiAvatar} alt="AI Assistant" className="AIchat-header-avatar" />
                            <p className="AIchat-user-name">AI Assistant</p>
                        </div>
                    </div>

                    <div className="AIchat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.type === "Ai-incoming" ? 'flex-start' : 'flex-end' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', flexDirection: msg.type === "Ai-incoming" ? 'row' : 'row-reverse', gap: '10px', marginBottom: '10px', width: 'fit-content', maxWidth: '80%' }}>
                                    {msg.type === "Ai-incoming" && msg.avatar && <img src={msg.avatar} alt="AI Avatar" className="message-avatar" />}
                                    <div className={msg.type === "Ai-incoming" ? "Ai-incoming-message" : "Ai-outgoing-message"}>
                                        {msg.text && <div className="message-text">{msg.text}</div>}
                                        {msg.content?.type === "buttons" && msg.type === "Ai-incoming" && (
                                            <div className="message-buttons">
                                                {msg.content.buttons.map((button, btnIndex) => (
                                                    <button key={btnIndex} onClick={() => handleButtonClick(button.action, button.text)} className="chat-button">{button.text}</button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="AIchat-input-area">
                        <input
                            type="text"
                            placeholder="Type a message...."
                            className="AIchat-input"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                        />
                        <FaMicrophone className="AIchat-icon" />
                        <ImAttachment className="AIchat-icon" />
                    </div>
                </div>
            </div>
            </div>
        </>
    );
}

export default AIChat;
