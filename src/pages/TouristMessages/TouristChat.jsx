import React, { useState } from 'react';
import WebsiteNavbar from '../../components/HomePageComponents/WebsiteNavbar';
import Sidebar from '../../components/HomePageComponents/Sidebar';
import { FaMicrophone} from 'react-icons/fa';
import { ImAttachment } from "react-icons/im";
import './TouristChat.css';
import LGSidebar from '../../components/LocalGuide/LG-Sidebar';


function TouristChat() {
    const userRoles = JSON.parse(localStorage.getItem("userRole")) || [];
    const [messages, setMessages] = useState([
        { text: "Hello, How can I help you?", type: "incoming", userId: 1 },
        { text: "Hello, I want to visit the pyramids", type: "outgoing", userId: 2, status: "sent" }
    ]);
    const [inputValue, setInputValue] = useState("");


    const [chatUsers, setChatUsers] = useState([
        {
            id: 1,
            name: "Ashraf Ahmed",
            preview: "Hello, How can I help you?",
            avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMC2LPWinJXv_YDQERAfQCFG37V6PiBn_d4A&s",
            unreadMessages: 0
        },
        {
            id: 2,
            name: "Mona Said",
            preview: "Sure, I can recommend some places!",
            avatar: "https://img.freepik.com/premium-photo/shot-young-female-tour-guide-leading-her-group-walking-tour-created-with-generative-ai_762026-49920.jpg",
            unreadMessages: 1
        },
        {
            id: 3,
            name: "Omar Adel",
            preview: "Let me know your budget first.",
            avatar: "https://media.istockphoto.com/id/842181676/photo/tourist-surfing-the-net-outdoors.jpg?s=612x612&w=0&k=20&c=_D3G_VqswUqUZSU-xa0r88dgYHfLhIGU2A1rXgmaxZs=",
            unreadMessages: 2
        }
    ]);

    const handleSendMessage = () => {
        if (inputValue.trim() !== "") {
            const userId = 1; 
            const newMessage = { text: inputValue, type: "outgoing", userId, status: "sent" };
            const newMessages = [...messages, newMessage];
            setMessages(newMessages);

          
            const updatedUsers = chatUsers.map(user => {
                if (user.id !== userId) {
                    return { ...user, unreadMessages: user.unreadMessages + 1 };
                }
                return user;
            });

            setChatUsers(updatedUsers);
            setInputValue("");
        }
    };

    return (
        <>
            <WebsiteNavbar />
            <div className="messages-page-container">
            <div className="messages-sidebar-container">
                {userRoles.includes("ROLE_LocalGuide") ? <LGSidebar /> : <Sidebar />}
            </div>
            <div className='touristchat-container'>
                <div className="touristchat-sidebar">
                    <h2>Chats</h2>
                    <input type="text" placeholder="Search here.." className="touristchat-search" />
                    {chatUsers.map(user => (
                        <div className="touristchat-user" key={user.id} style={{ position: 'relative' }}>
                            <img src={user.avatar} alt={user.name} className="touristchat-user-avatar" />
                            <div>
                                <p className="touristchat-user-name">{user.name}</p>
                                <p className="touristchat-user-msg-preview">{user.preview}</p>
                            </div>
                            {user.unreadMessages > 0 && (
                                <div className="unread-message-badge">{user.unreadMessages}</div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="touristchat-content">
                    <div className="touristchat-header">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMC2LPWinJXv_YDQERAfQCFG37V6PiBn_d4A&s" alt="Ashraf Ahmed" className="user-avatar" />
                        <p className="touristchat-user-name">Ashraf Ahmed</p>
                    </div>

                <div className="touristchat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.type === "incoming" ? 'flex-start' : 'flex-end' }}>
                            <div className={msg.type === "incoming" ? "incoming-message" : "outgoing-message"}>
                                <div className="message-text">
                                    {msg.text}
                                </div>
                            </div>
                            {msg.type === "outgoing" && (
                                <div className="message-status">{msg.status}</div>
                            )}
                        </div>
                    ))}
                </div>

                    <div className="touristchat-input-area">
                        <input
                            type="text"
                            placeholder="Type a message...."
                            className="touristchat-input"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                        />
                        <FaMicrophone className="touristchat-icon" />
                        <ImAttachment className="touristchat-icon" />
                    </div>
                </div>
            </div>
            </div>
        </>
    );
}

export default TouristChat;
