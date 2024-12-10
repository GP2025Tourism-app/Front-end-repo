import React, { useState } from "react";
import Header from '../../components/Header/Header'; 
import ReusableSection from '../../components/ReuasbleSection/ReuseSection'; 
import LeftImagesRightTextSection from '../../components/ReuasbleSection/ReuseableLeftandRight';
import OneImageRightTextSection from '../../components/ReuasbleSection/OneImageRightTextSection';
import VideosSection from '../../components/ReuasbleSection/VideosSection';
import CardsSection from '../../components/ReuasbleSection/CardsSection';
import Footer from '../../components/Footer/Footer';
import LoginPage from '../LoginPage/LoginPage';
import SignUpPage from "../SignUpPage/SignUpPage";


const cardsData = [
  {
    imageSrc: 'https://via.placeholder.com/150',
    title: 'Card 1',
    description: 'Description for card 1.',
  },
  {
    imageSrc: 'https://via.placeholder.com/150',
    title: 'Card 2',
    description: 'Description for card 2.',
  },
  {
    imageSrc: 'https://via.placeholder.com/150',
    title: 'Card 3',
    description: 'Description for card 3.',
  },
  {
    imageSrc: 'https://via.placeholder.com/150',
    title: 'Card 4',
    description: 'Description for card 4.',
  },
];


function LandingPage() {
  const [showLoginPopup, setShowLoginPopup] = useState(false); // State to control popup visibility
  const [showsignupPopup, setShowsignupPopup] = useState(false);
  // Function to show the login popup
  const handleLoginClick = () => {
    setShowLoginPopup(true);
  };
  const handlesignupClick = () => {
    setShowsignupPopup(true);
  };

  // Function to close the login popup
  const handleClosePopup = () => {
    setShowLoginPopup(false);
    setShowsignupPopup(false);
  };

  return (
    <div>
      
      <Header onLoginClick={handleLoginClick}  onSinupClick={handlesignupClick}/>

      <LoginPage show={showLoginPopup} onClose={handleClosePopup} /> 
      <SignUpPage show={showsignupPopup} onClose={handleClosePopup} /> 
      <ReusableSection
        title="Explore Egypt's Wonders"
        description="Experience the breathtaking landscapes and historical landmarks of Egypt."
        images={[
          { src: 'https://via.placeholder.com/300x200', alt: 'Image 1' },
          { src: 'https://via.placeholder.com/300x200', alt: 'Image 2' },
          { src: 'https://via.placeholder.com/300x200', alt: 'Image 3' },
        ]}
        backgroundColor="#fff"
      />

        
      <LeftImagesRightTextSection
      title="Meet Egypt's Expert Local Tour Guides"
      description="Connect with passionate, knowledgeable guides who bring Egypt’s rich history and culture to life."
      images={[
        { src: 'https://via.placeholder.com/300x200', alt: 'Guide 1' },
        { src: 'https://via.placeholder.com/300x200', alt: 'Guide 2' },
        { src: 'https://via.placeholder.com/300x200', alt: 'Guide 3' },
      ]}
        reverseLayout={false} // This will make images on the left and text on the right
        background="#757272" // Dark background, white text
      />

    <LeftImagesRightTextSection
      title="Your Virtual Tour Guide, 
      Anytime, Anywhere"
      description="Explore Egypt at your own pace with our interactive, AI-powered virtual tour guide."
      images={[
        { src: 'https://via.placeholder.com/300x200', alt: 'Guide 1' },
        { src: 'https://via.placeholder.com/300x200', alt: 'Guide 2' },
        { src: 'https://via.placeholder.com/300x200', alt: 'Guide 3' },
      ]}
      reverseLayout={true} // This will make images on the right and text on the left
      backgroundColor="#fff" // Light background, black text
    />


       <ReusableSection
        title="Chat Live with Local Tour Guides"
        description="Get real-time answers, advice, and recommendations directly from Egypt’s expert guides."
        images={[
          { src: 'https://via.placeholder.com/300x200', alt: 'Image 1' },
          { src: 'https://via.placeholder.com/300x200', alt: 'Image 2' },
          { src: 'https://via.placeholder.com/300x200', alt: 'Image 3' },
        ]}
        background="#757272"
      />


       <OneImageRightTextSection
        title="Egypt is breathtaking! From the pyramids to the Nile, every moment feels like a step back in time. The culture, history, and people make it unforgettable!"
        description="– Sophia Carter, Travel Blogger from the USA"
        images={[
          { src: 'https://via.placeholder.com/500x300', alt: 'Pyramids' },
        ]}
        backgroundColor="#fff"  // Dark background color for this section
      />


      <VideosSection
        title="Egypt Through Their Eyes"
        description="Explore Egypt through the perspectives of our local guides and travelers."
        images={[
          { src: 'https://via.placeholder.com/300x400', alt: 'Image 1' },
          { src: 'https://via.placeholder.com/300x400', alt: 'Image 2' },
          { src: 'https://via.placeholder.com/300x400', alt: 'Image 3' },
          { src: 'https://via.placeholder.com/300x400', alt: 'Image 4' },
        ]}
      />


       <CardsSection
        title="Advice, stories & solo travel tips!"
        cards={cardsData}
      />

      <Footer />

    </div>
  );
}

export default LandingPage;
