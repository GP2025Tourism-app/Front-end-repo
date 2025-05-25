import React, { useState, useEffect, useRef } from 'react';
import WebsiteNavbar from '../../components/HomePageComponents/WebsiteNavbar';
import Sidebar from '../../components/HomePageComponents/Sidebar';
import { FaMicrophone } from 'react-icons/fa';
import { ImAttachment } from "react-icons/im";
import './TouristChat.css';
import LGSidebar from '../../components/LocalGuide/LG-Sidebar';
import { useLocation } from "react-router-dom";

function TouristChat() {
    const userRoles = JSON.parse(localStorage.getItem("userRole")) || [];
    const currentUserUsername = JSON.parse(localStorage.getItem('username'));
    const [chatUsers, setChatUsers] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef(null);

    const defaultAvatar = 'https://via.placeholder.com/50';

    // Get navigation state (if any)
    const location = useLocation();
    const { receiverUsername, receiverRole } = location.state || {};

    useEffect(() => {
        fetchChats();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // If navigated from MyBookings, set up the chat input for that guide
    useEffect(() => {
        if (receiverUsername && receiverRole) {
            setActiveChat({
                id: receiverUsername,
                name: receiverUsername,
                avatar: defaultAvatar,
                idrole: receiverRole
            });
            setMessages([]); // No history yet
        }
    }, [receiverUsername, receiverRole]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const fetchChats = () => {
        const token = localStorage.getItem('authToken');
        fetch('http://localhost:8080/msg/chats', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                const users = data.map(chat => ({
                    id: chat.sender.username,
                    name: `${chat.sender.firstname} ${chat.sender.lastname}`,
                    avatar: chat.sender.profilePic || defaultAvatar,
                    preview: chat.messages[chat.messages.length - 1]?.content || "No messages yet",
                    unreadMessages: chat.unreadCounts,
                    idrole: chat.sender.role.name
                }));
                setChatUsers(users);
                // If not coming from booking and no active chat is set, auto-load the first chat
                // This ensures that if you send a message, and activeChat is already set,
                // it remains set after fetchChats updates the sidebar.
                if (!receiverUsername && !activeChat && users.length > 0) {
                    loadChat(users[0]);
                } else if (activeChat) {
                    // If there's an active chat, find it in the updated list and reload it
                    const updatedActiveChat = users.find(user => user.id === activeChat.id);
                    if (updatedActiveChat) {
                        setActiveChat(updatedActiveChat);
                    }
                }
            })
            .catch(error => console.error('Error fetching chats:', error));
    };

    const loadChat = (user) => {
        const token = localStorage.getItem('authToken');
        fetch(`http://localhost:8080/msg/mychat?senderUsername=${user.id}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                const formattedMessages = data.map(msg => ({
                    text: msg.content,
                    senderUsername: msg.senderUsername,
                    dateTime: msg.dateTime
                }));
                setMessages(formattedMessages);
                setActiveChat(user);
                // After loading a chat, consider marking messages as read on the backend
                // This is a common practice to update unread counts in the sidebar
                markMessagesAsRead(user.id);
            })
            .catch(error => console.error('Error fetching chat messages:', error));
    };

    const markMessagesAsRead = (senderUsername) => {
        const token = localStorage.getItem('authToken');
        fetch(`http://localhost:8080/msg/read?senderUsername=${senderUsername}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // If messages are marked as read, re-fetch chats to update unread counts in sidebar
                fetchChats();
            } else {
                console.error('Failed to mark messages as read');
            }
        })
        .catch(error => console.error('Error marking messages as read:', error));
    };

    const handleSendMessage = () => {
        if (inputValue.trim() === "" || !activeChat) return;

        const token = localStorage.getItem('authToken');
        const messageData = {
            receiverUsername: activeChat.id,
            rcvRole: { name: activeChat.idrole },
            content: inputValue
        };

        console.log("Sending messageData:", messageData);

        // Optimistically update the UI to show the message immediately
        setMessages(prevMessages => [...prevMessages, {
            text: inputValue,
            senderUsername: currentUserUsername,
            dateTime: new Date().toISOString()
        }]);
        setInputValue("");

        fetch('http://localhost:8080/msg/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(messageData)
        })
        .then(async response => {
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error('Failed to send message: ' + errorText);
            }
            // After successful send, reload the current chat messages to ensure consistency
            // and then re-fetch chats to update the sidebar with the new preview and unread counts.
            loadChat(activeChat); // Reloads the messages for the active chat
            fetchChats(); // Updates the chat list in the sidebar
        })
        .catch(error => {
            console.error('Error sending message:', error);
            // Optionally, revert the optimistic update or show an error to the user
        });
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
                            <div
                                className={`touristchat-user ${activeChat?.id === user.id ? 'active' : ''}`}
                                key={user.id}
                                style={{ position: 'relative', cursor: 'pointer' }}
                                onClick={() => loadChat(user)}
                            >
                                <img
                                    src={user.avatar || defaultAvatar}
                                    alt={user.name}
                                    className="touristchat-user-avatar"
                                />
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
                        {activeChat ? (
                            <>
                                <div className="touristchat-header">
                                    <img
                                        src={activeChat.avatar || defaultAvatar}
                                        alt={activeChat.name}
                                        className="user-avatar"
                                    />
                                    <p className="touristchat-user-name">{activeChat.name}</p>
                                </div>

                                <div className="touristchat-messages">
                                    {messages.map((msg, index) => {
                                        const isMyMessage = msg.senderUsername === currentUserUsername;
                                        return (
                                            <div
                                                key={index}
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: isMyMessage ? 'flex-end' : 'flex-start'
                                                }}
                                            >
                                                <div className={isMyMessage ? "outgoing-message" : "incoming-message"}>
                                                    <div className="message-text">
                                                        {msg.text}
                                                    </div>
                                                </div>
                                                <div className="message-time">
                                                    {new Date(msg.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                <div className="touristchat-input">
                                    <input
                                        className="message-input"
                                        type="text"
                                        placeholder="Type a message..."
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    />
                                    <ImAttachment className="input-icon" />
                                    <FaMicrophone className="input-icon" />
                                </div>
                            </>
                        ) : (
                            <div className="no-chat-selected">
                                <p>Select a chat to start messaging</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default TouristChat;