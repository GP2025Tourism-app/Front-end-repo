// src/AIChat.js (or wherever your AIChat component is)

import React, { useState, useEffect, useRef } from 'react';

import './AIChat.css';

import WebsiteNavbar from '../../components/HomePageComponents/WebsiteNavbar';

import Sidebar from '../../components/HomePageComponents/Sidebar';

import { FaMicrophone } from 'react-icons/fa';

import { ImAttachment } from "react-icons/im";

import { PiSpeakerHighFill } from "react-icons/pi";

import aiAvatar from '../../assets/images/Ai-avatar.svg';

import AudioPlayer from './AudioPlayer';

function AIChat() {
    const token = localStorage.getItem("authToken");

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
    const [translationMode, setTranslationMode] = useState(false);
    const [translationInputType, setTranslationInputType] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // <-- Loading state added

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const fileInputRef = useRef(null);

    const CLOUD_NAME = "da6gcu1n9";
    const UPLOAD_PRESET = "graduationproject";

    const scrollToBottom = () => {
        const messagesContainer = document.querySelector('.AIchat-messages');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const playAudio = (base64Audio) => {
        if (base64Audio && base64Audio.startsWith('http')) {
            const audio = new Audio(base64Audio);
            audio.play().catch(e => console.error("Error playing audio from URL:", e));
        } else if (base64Audio) {
            const audio = new Audio(`data:audio/mpeg;base64,${base64Audio}`);
            audio.play().catch(e => console.error("Error playing audio from Base64:", e));
        }
    };

    const uploadFileToCloudinary = async (file, resourceType) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (data.secure_url) {
                return data.secure_url;
            } else {
                throw new Error('Cloudinary upload failed: No secure URL returned.');
            }
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            alert('Failed to upload file. Please try again.');
            return null;
        }
    };

    const handleButtonClick = async (action, buttonText) => {
        const userId = 2;
        const newMessage = { text: buttonText, type: "Ai-outgoing", userId, status: "sent" };
        setMessages(prevMessages => [...prevMessages, newMessage]);

        // Handle "Exit" button: reset chat to very first message
        if (action === "exit_to_start") {
            setTranslationMode(false);
            setTranslationInputType('');
            setMessages([
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
            return;
        }

        if (action === "translate") {
            setTranslationMode(true);
            setMessages(prevMessages => [
                ...prevMessages,
                {
                    text: "Great! What type of content do you want to translate?",
                    type: "Ai-incoming",
                    userId: 1,
                    avatar: aiAvatar,
                    content: {
                        type: "buttons",
                        buttons: [
                            { text: "Text", action: "translate_text" },
                            { text: "Image", action: "translate_image" },
                            { text: "Audio", action: "translate_audio" },
                            { text: "Exit", action: "exit_to_start" },
                        ],
                    },
                },
            ]);
            return;
        }

        if (translationMode && (action === "translate_text" || action === "translate_image" || action === "translate_audio")) {
            setTranslationInputType(action.split('_')[1]);
            setMessages(prevMessages => [
                ...prevMessages,
                {
                    text: `Please provide the ${action.split('_')[1]} content for translation.`,
                    type: "Ai-incoming",
                    userId: 1,
                    avatar: aiAvatar,
                },
            ]);
            return;
        }

        // Show loading before AI response
        setIsLoading(true);

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
                            text: "What’s your budget range for this trip?",
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
                default:
                    break;
            }
            setIsLoading(false);
        }, 500);
    };

    const handleSendMessage = async (content, type) => {
        if (content.trim() === "" && type === "text") return;

        const userId = 2;
        const newMessage = {
            type: "Ai-outgoing",
            userId,
            status: "sent",
            text: type === "text" ? content : '',
            imageUrl: type === "image" ? content : null,
            audioUrl: type === "audio" ? content : null,
        };

        if (type === 'text' || type === 'image' || (type === 'audio' && content.startsWith('http'))) {
            setMessages(prevMessages => [...prevMessages, newMessage]);
        }
        setInputValue("");

        if (translationMode && type) {
            try {
                let contentToSend = content;

                const requestBody = {
                    inputType: type,
                    content: contentToSend,
                };

                setIsLoading(true);

                const response = await fetch('http://localhost:8080/ai/translate', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });

                const data = await response.json();

                setMessages(prevMessages => [...prevMessages, {
                    text: data.translated_text || "Translation failed.",
                    type: "Ai-incoming",
                    userId: 1,
                    avatar: aiAvatar,
                    audioData: data.tts_audio_base64
                }]);

                if (data.tts_audio_base64) {
                    playAudio(data.tts_audio_base64);
                }

                setTranslationInputType('');
                setMessages(prevMessages => [
                    ...prevMessages,
                    {
                        text: "Is there anything else you'd like to translate? Please choose the content type. If not please click Exit",
                        type: "Ai-incoming",
                        userId: 1,
                        avatar: aiAvatar,
                        content: {
                            type: "buttons",
                            buttons: [
                                { text: "Text", action: "translate_text" },
                                { text: "Image", action: "translate_image" },
                                { text: "Audio", action: "translate_audio" },
                                { text: "Exit", action: "exit_to_start" },
                            ],
                        },
                    },
                ]);
            } catch (error) {
                console.error('Error during translation:', error);
                setMessages(prevMessages => [...prevMessages, { text: "Sorry, I couldn't process the translation request. Please try again.", type: "Ai-incoming", userId: 1, avatar: aiAvatar }]);
                setTranslationMode(false);
                setTranslationInputType('');
            } finally {
                setIsLoading(false);
            }
        } else if (type === 'text') {
            setIsLoading(true);
            setTimeout(() => {
                const aiResponse = `You said: "${content}". How else can I help?`;
                setMessages(prevMessages => [...prevMessages, { text: aiResponse, type: "Ai-incoming", userId: 1, avatar: aiAvatar }]);
                setIsLoading(false);
            }, 1000);
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const resourceType = file.type.startsWith('image') ? 'image' : 'video';
            const cloudinaryUrl = await uploadFileToCloudinary(file, resourceType);
            if (cloudinaryUrl) {
                handleSendMessage(cloudinaryUrl, translationInputType);
            }
        }
        event.target.value = null;
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const tempMessageId = Date.now();
                setMessages(prevMessages => [...prevMessages, { type: "Ai-outgoing", userId: 2, status: "pending", id: tempMessageId }]);

                try {
                    const audioFile = new File([audioBlob], "recorded_audio.webm", { type: 'audio/webm' });
                    const cloudinaryUrl = await uploadFileToCloudinary(audioFile, 'video');

                    if (cloudinaryUrl) {
                        setMessages(prevMessages => prevMessages.map(msg =>
                            msg.id === tempMessageId
                                ? { ...msg, audioUrl: cloudinaryUrl, status: "sent" }
                                : msg
                        ));
                        handleSendMessage(cloudinaryUrl, 'audio'); // Trigger translation logic
                    } else {
                        setMessages(prevMessages => prevMessages.map(msg =>
                            msg.id === tempMessageId
                                ? { ...msg, text: "Audio upload failed.", status: "failed" }
                                : msg
                        ));
                        console.error("Failed to upload recorded audio to Cloudinary.");
                    }
                } catch (error) {
                    console.error("Error during audio recording or upload:", error);
                    setMessages(prevMessages => prevMessages.map(msg =>
                        msg.id === tempMessageId
                            ? { ...msg, text: "Error processing audio.", status: "failed" }
                            : msg
                    ));
                }
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Could not access microphone. Please ensure it is enabled and try again.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
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
                                            {msg.imageUrl && <img src={msg.imageUrl} alt="Uploaded" style={{ maxWidth: '100%', borderRadius: '8px' }} />}
                                            {/* Use the custom AudioPlayer component here */}
                                            {msg.audioUrl && <AudioPlayer audioUrl={msg.audioUrl} />}
                                            {msg.content?.type === "buttons" && msg.type === "Ai-incoming" && (
                                                <div className="message-buttons">
                                                    {msg.content.buttons.map((button, btnIndex) => (
                                                        <button key={btnIndex} onClick={() => handleButtonClick(button.action, button.text)} className="chat-button">{button.text}</button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        {msg.type === "Ai-incoming" && msg.audioData && (
                                            <PiSpeakerHighFill
                                                className="speaker-icon"
                                                onClick={() => playAudio(msg.audioData)}
                                                style={{ cursor: 'pointer', marginLeft: '5px' , alignSelf:'center'}}
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Loading message */}
                            {isLoading && (
                                <div className="loading-message" style={{ alignSelf: 'flex-start', marginBottom: '10px', fontStyle: 'italic', color: '#666' }}>
                                    AI is typing...
                                </div>
                            )}
                        </div>

                        <div className="AIchat-input-area">
                            <input
                                type="text"
                                placeholder="Type a message...."
                                className="AIchat-input"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => { if (e.key === 'Enter') handleSendMessage(inputValue, 'text'); }}
                                disabled={translationMode && (translationInputType === 'audio' || translationInputType === 'image')}
                            />

                            {translationMode && translationInputType === 'audio' ? (
                                isRecording ? (
                                    <FaMicrophone className="AIchat-icon recording" onClick={stopRecording} title="Stop Recording" />
                                ) : (
                                    <FaMicrophone className="AIchat-icon" onClick={startRecording} title="Start Recording" />
                                )
                            ) : (
                                <FaMicrophone className="AIchat-icon" onClick={startRecording} title="Start Recording" />
                            )}

                            <input
                                type="file"
                                accept={translationInputType === 'image' ? "image/*" : translationInputType === 'audio' ? "audio/*" : ""}
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileUpload}
                            />

                            <ImAttachment className="AIchat-icon" onClick={() => fileInputRef.current.click()} title="Attach File" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AIChat;
