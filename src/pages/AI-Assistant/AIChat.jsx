import React, { useState, useEffect, useRef } from 'react';
import './AIChat.css';
import WebsiteNavbar from '../../components/HomePageComponents/WebsiteNavbar';
import Sidebar from '../../components/HomePageComponents/Sidebar';
import { FaMicrophone } from 'react-icons/fa';
import { ImAttachment } from "react-icons/im";
import { PiSpeakerHighFill } from "react-icons/pi";
import aiAvatar from '../../assets/images/Ai-avatar.svg';
import AudioPlayer from './AudioPlayer';
 // Assuming AudioPlayer component is correctly implemented

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
                    { text: "Ask about anything 🤔", action: "ask_question" },
                    { text: "Use translation services 🌐", action: "translate" },
                ],
            },
        },
    ]);
    
    const [inputValue, setInputValue] = useState("");
    const [translationMode, setTranslationMode] = useState(false);
    const [translationInputType, setTranslationInputType] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // <-- Loading state
    const [selectedInterests, setSelectedInterests] = useState([]); // New state for selected interests
    const [isSelectingInterests, setIsSelectingInterests] = useState(false); // New state to manage interest selection mode
    const [selectedAgeRanges, setSelectedAgeRanges] = useState([]); // New state for selected age ranges
    const [isSelectingAgeRanges, setIsSelectingAgeRanges] = useState(false); // New state to manage age range selection mode
    
    
    const formatSimpleText = (text) => {
    
        let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
        formattedText = formattedText.replace(/\n/g, '<br />');
    
        return formattedText;
    }
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
    
    // --- Modified sendChatMessage Function ---
    const sendChatMessage = async (userMessage) => {
        setIsLoading(true); // Show loading state
        try {
            const response = await fetch('http://localhost:8080/ai/chat', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            const aiResponseContent = data.response;
            // Prioritize message, then question, then plan, then a default error
            const aiResponseText = aiResponseContent?.message || aiResponseContent?.question || aiResponseContent?.plan || "Sorry, I couldn't get a response.";
    
            // Handle specific question types with buttons
            if (aiResponseContent?.response_type === "question") {
                let buttons = [];
                if (aiResponseContent.question.includes("Choose a price range")) {
                    buttons = ["Low", "Mid", "Fancy"].map(budget => ({
                        text: budget,
                        action: `budget_${budget.toLowerCase()}`
                    }));
                } else if (aiResponseContent.question.includes("Select age range(s)")) {
                    const ageRanges = ["Child", "Teen", "Adult", "Senior"];
                    buttons = ageRanges.map(age => ({
                        text: age,
                        action: `age_range_select_${age.toLowerCase()}` // Modified action
                    }));
                    // REMOVED: buttons.push({ text: "Send Age Ranges", action: "send_age_ranges" });
                    setIsSelectingAgeRanges(true); // Enter age range selection mode
                    setSelectedAgeRanges([]); // Clear previous selection
                    setInputValue(''); // Clear input
                } else if (aiResponseContent.question.includes("Preferred travel month")) {
                    const travelMonths = ["Spring", "Summer", "Autumn", "Winter"];
                    buttons = travelMonths.map(month => ({
                        text: month,
                        action: `travel_month_${month.toLowerCase()}`
                    }));
                } else if (aiResponseContent.question.includes("Preferred transportation")) {
                    const transportationOptions = ["Car", "Public"];
                    buttons = transportationOptions.map(option => ({
                        text: option,
                        action: `transportation_${option.toLowerCase()}`
                    }));
                } else if (aiResponseContent.question.includes("What are your interests?")) {
                    const interestOptions = ["Adventure", "Historical", "Entertainment", "Relaxing", "Museum", "Shopping", "Beaches", "Religious", "Cultural"];
                    buttons = interestOptions.map(interest => ({
                        text: interest,
                        action: `interest_select_${interest.toLowerCase()}`
                    }))
                    setIsSelectingInterests(true);
                    setSelectedInterests([]);
                    setInputValue('');
                }
                // Add the question and its associated buttons
                setMessages(prevMessages => [...prevMessages, {
                    text: aiResponseContent.question,
                    type: "Ai-incoming",
                    userId: 1,
                    avatar: aiAvatar,
                    content: {
                        type: "buttons",
                        buttons: buttons,
                    },
                }]);
            }
            // Handle trip plan generation with a follow-up question and options
            else if (aiResponseContent?.response_type === "plan_and_question") {
                setMessages(prevMessages => [
                    ...prevMessages,
                    {
                        text: aiResponseContent.plan,
                        type: "Ai-incoming",
                        userId: 1,
                        avatar: aiAvatar,
                    },
                    {
                        text: aiResponseContent.question,
                        type: "Ai-incoming",
                        userId: 1,
                        avatar: aiAvatar,
                    },
                ]);
            }
            // Handle a final trip plan response (without immediate follow-up questions)
            else if (aiResponseContent?.response_type === "final_plan") {
                setMessages(prevMessages => [
                    ...prevMessages,
                    {
                        text: aiResponseContent.plan, // Display the final plan
                        type: "Ai-incoming",
                        userId: 1,
                        avatar: aiAvatar,
                    },
                    // You might want to add a general follow-up question here
                    // For example: "Your plan is ready! Is there anything else I can help with?"
                    // Or: "Would you like to save this plan?"
                    {
                        text: "Your trip plan is ready! What would you like to do next?",
                        type: "Ai-incoming",
                        userId: 1,
                        avatar: aiAvatar,
    
                    },
                ]);
            }
            // Default case for simple text messages
            else {
                setMessages(prevMessages => [...prevMessages, {
                    text: aiResponseText,
                    type: "Ai-incoming",
                    userId: 1,
                    avatar: aiAvatar,
                }]);
            }
    
        } catch (error) {
            console.error('Error during chat API call:', error);
            setMessages(prevMessages => [...prevMessages, {
                text: "Sorry, I'm having trouble connecting right now. Please try again later.",
                type: "Ai-incoming",
                userId: 1,
                avatar: aiAvatar,
            }]);
        } finally {
            setIsLoading(false); // Hide loading state
        }
    };
    
    
    const handleButtonClick = async (action, buttonText) => {
        const userId = 2; // User ID
        // Declare newMessage here so it's available for all cases that use it
        const newMessage = { text: buttonText, type: "Ai-outgoing", userId, status: "sent" };
    
        if (action.startsWith("interest_select_")) {
            // Add or remove interest from selectedInterests
            setSelectedInterests(prevSelected => {
                const interest = buttonText.replace("️", "").trim(); // Remove emoji if present for internal logic
                if (prevSelected.includes(interest)) {
                    const newSelection = prevSelected.filter(item => item !== interest);
                    setInputValue(newSelection.join(', '));
                    return newSelection;
                } else {
                    const newSelection = [...prevSelected, interest];
                    setInputValue(newSelection.join(', '));
                    return newSelection;
                }
            });
            // Do not send message immediately, just update input field
            return;
        }
    
        if (action === "send_interests") {
            if (selectedInterests.length > 0) {
                const interestsString = selectedInterests.join(', ');
                setMessages(prevMessages => [...prevMessages, { text: interestsString, type: "Ai-outgoing", userId, status: "sent" }]);
                await sendChatMessage(interestsString);
                setSelectedInterests([]); // Clear selection after sending
                setIsSelectingInterests(false); // Exit interest selection mode
                setInputValue(''); // Clear input after sending
            } else {
                // No interests selected, provide feedback
                setMessages(prevMessages => [...prevMessages, { text: "No interests selected.", type: "Ai-outgoing", userId, status: "sent" }]);
                setMessages(prevMessages => [...prevMessages, {
                    text: "Please select at least one interest or click 'Exit' to go back.",
                    type: "Ai-incoming",
                    userId: 1,
                    avatar: aiAvatar,
                    // Re-add interest buttons for the user to select
                    content: {
                        type: "buttons",
                        buttons: [
                            { text: "Adventure", action: "interest_select_adventure" },
                            { text: "Historical", action: "interest_select_historical" },
                            { text: "Entertainment", action: "interest_select_entertainment" },
                            { text: "Relaxing", action: "interest_select_relaxing" },
                            { text: "Museum", action: "interest_select_museum" },
                            { text: "Shopping", action: "interest_select_shopping" },
                            { text: "Beaches", action: "interest_select_beaches" },
                            { text: "Religious", action: "interest_select_religious" },
                            { text: "Cultural", action: "interest_select_cultural" },
                            { action: "exit_to_start", text: "Exit" }
                        ]
                    }
                }]);
            }
            return;
        }
    
        // --- Age Range Selection Logic ---
        if (action.startsWith("age_range_select_")) {
            setSelectedAgeRanges(prevSelected => {
                const ageRange = buttonText.trim();
                if (prevSelected.includes(ageRange)) {
                    const newSelection = prevSelected.filter(item => item !== ageRange);
                    setInputValue(newSelection.join(', '));
                    return newSelection;
                } else {
                    const newSelection = [...prevSelected, ageRange];
                    setInputValue(newSelection.join(', '));
                    return newSelection;
                }
            });
            return; // Do not send message immediately, just update input field
        }
    
        if (action === "send_age_ranges") {
            if (selectedAgeRanges.length === 0) {
                setMessages(prevMessages => [...prevMessages, { text: "No age ranges selected.", type: "Ai-outgoing", userId, status: "sent" }]);
                setMessages(prevMessages => [...prevMessages, {
                    text: "Please select at least one age range.",
                    type: "Ai-incoming",
                    userId: 1,
                    avatar: aiAvatar,
                    // Re-add age range buttons for the user to select
                    content: {
                        type: "buttons",
                        buttons: [
                            { text: "Child", action: "age_range_select_child" },
                            { text: "Teen", action: "age_range_select_teen" },
                            { text: "Adult", action: "age_range_select_adult" },
                            { text: "Senior", action: "age_range_select_senior" },
                            
                        ]
                    }
                }]);
            } else if (selectedAgeRanges.includes("Child") && selectedAgeRanges.length === 1) {
                setMessages(prevMessages => [...prevMessages, { text: "Selected: Child", type: "Ai-outgoing", userId, status: "sent" }]);
                setMessages(prevMessages => [...prevMessages, {
                    text: "Child can't be selected only, you must also select at least one other age range.",
                    type: "Ai-incoming",
                    userId: 1,
                    avatar: aiAvatar,
                    // Re-add age range buttons for the user to select
                    content: {
                        type: "buttons",
                        buttons: [
                            { text: "Child", action: "age_range_select_child" },
                            { text: "Teen", action: "age_range_select_teen" },
                            { text: "Adult", action: "age_range_select_adult" },
                            { text: "Senior", action: "age_range_select_senior" },
                           
                        ]
                    }
                }]);
            } else {
                const ageRangesString = selectedAgeRanges.join(', ');
                setMessages(prevMessages => [...prevMessages, { text: ageRangesString, type: "Ai-outgoing", userId, status: "sent" }]);
                await sendChatMessage(ageRangesString);
                setSelectedAgeRanges([]); // Clear selection after sending
                setIsSelectingAgeRanges(false); // Exit age range selection mode
                setInputValue(''); // Clear input after sending
            }
            return;
        }
        // --- End Age Range Selection Logic ---
    
        // For regular button clicks that are NOT multi-select specific actions
        // This line is now safe because newMessage is declared at the top
        setMessages(prevMessages => [...prevMessages, newMessage]);
    
    
        if (action === "exit_to_start") {
            setTranslationMode(false);
            setTranslationInputType('');
            setIsSelectingInterests(false); // Exit interest selection mode
            setSelectedInterests([]); // Clear selected interests
            setIsSelectingAgeRanges(false); // Exit age range selection mode
            setSelectedAgeRanges([]); // Clear selected age ranges
            setInputValue(''); // Clear input field
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
                            { text: "Ask about anything 🤔", action: "ask_question" },
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
        // Handle 'Plan a trip' and 'Ask general questions' actions here
        if (action === "plan_trip" || action === "ask_question" || action.startsWith("budget_") || action.startsWith("age_range_") || action.startsWith("change_plan_") || action.startsWith("travel_month_") || action.startsWith("transportation_")) {
            await sendChatMessage(buttonText); // Send the button's text as the message
            return;
        }
    
        // The default timeout logic for other actions remains (or can be modified/removed)
        setIsLoading(true);
        setTimeout(() => {
            let aiResponse = "";
            switch (action) {
                case "budget_low":
                case "budget_mid":
                case "budget_fancy":
                    aiResponse = `Okay, noted your ${buttonText} budget. What destinations are you considering?`;
                    break;
                case "travel_month_spring":
                case "travel_month_summer":
                case "travel_month_autumn":
                case "travel_month_winter":
                    aiResponse = `Got it! You prefer to travel in the ${buttonText}. What kind of activities are you hoping for?`;
                    break;
                case "transportation_car":
                case "transportation_public":
                    aiResponse = `Understood. You prefer ${buttonText} for transportation. Now, let's talk about your ideal accommodation.`;
                    break;
                default:
                    aiResponse = "I'm not sure how to respond to that specific action. Please choose from the options.";
                    break;
            }
            setMessages(prevMessages => [...prevMessages, { text: aiResponse, type: "Ai-incoming", userId: 1, avatar: aiAvatar }]);
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

                setTranslationInputType(''); // Clear translation input type after translation
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
            await sendChatMessage(content);
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
                        handleSendMessage(cloudinaryUrl, 'audio');
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
                                    <div style={{ display: 'flex', alignItems: 'flex-start', flexDirection: msg.type === "Ai-incoming" ? 'row' : 'row-reverse', gap: '10px', marginBottom: '10px', maxWidth: '80%'}}>
                                        {msg.type === "Ai-incoming" && msg.avatar && <img src={msg.avatar} alt="AI Avatar" className="message-avatar" />}
                                        <div className={msg.type === "Ai-incoming" ? "Ai-incoming-message" : "Ai-outgoing-message"}>
                                        {msg.text && <div className="message-text" dangerouslySetInnerHTML={{ __html: formatSimpleText(msg.text) }}></div>}
                                            {msg.imageUrl && <img src={msg.imageUrl} alt="Uploaded" style={{ maxWidth: '100%', borderRadius: '8px' }} />}
                                            {/* Use the custom AudioPlayer component here */}
                                            {msg.audioUrl && <AudioPlayer audioUrl={msg.audioUrl} />}
                                            {msg.content?.type === "buttons" && msg.type === "Ai-incoming" && (
    <div className="message-buttons">
        {msg.content.buttons.map((button, btnIndex) => (
            <button
                key={btnIndex}
                onClick={() => handleButtonClick(button.action, button.text)}
                className={`
                    chat-button
                    ${isSelectingInterests && selectedInterests.includes(button.text.replace("️", "").trim()) ? 'selected-interest' : ''}
                    ${isSelectingAgeRanges && selectedAgeRanges.includes(button.text.trim()) ? 'selected-age-range' : ''}
                `}
                disabled={
                    isLoading &&
                    !button.action.startsWith("interest_select_") &&
                    !button.action.startsWith("age_range_select_") && // Don't disable age range selection buttons during loading
                    button.action !== "send_interests" &&
                    button.action !== "send_age_ranges" // Don't disable send age range button during loading
                }
            >
                {button.text}
            </button>
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
        onKeyPress={(e) => { 
            // Disable Enter key for multi-select modes
            if (e.key === 'Enter' && !isSelectingInterests && !isSelectingAgeRanges) {
                handleSendMessage(inputValue, 'text'); 
            }
        }}
        // Disable input during loading and both multi-selection modes
        disabled={translationMode && (translationInputType === 'audio' || translationInputType === 'image') || isLoading || isSelectingInterests || isSelectingAgeRanges}
    />
    {isSelectingInterests ? (
        <button
            onClick={() => handleButtonClick("send_interests", "Send Selected Interests")} // Added buttonText
            className="send-interests-button"
            disabled={isLoading}
        >
            Send Interests
        </button>
    ) : isSelectingAgeRanges ? ( // Add this new condition for age range selection
        <button
            onClick={() => handleButtonClick("send_age_ranges", "Send Selected Age Ranges")} // Added buttonText
            className="send-age-ranges-button"
            disabled={isLoading}
        >
            Send Age Ranges
        </button>
    ) : (
        <>
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
        </>
    )}

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AIChat;