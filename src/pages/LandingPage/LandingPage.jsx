import React, { useState,useRef } from "react";
import Header from '../../components/Header/Header'; 
import ReusableSection from '../../components/ReuasbleSection/ReuseSection'; 
import LeftImagesRightTextSection from '../../components/ReuasbleSection/ReuseableLeftandRight';
import OneImageRightTextSection from '../../components/ReuasbleSection/OneImageRightTextSection';
import VideosSection from '../../components/ReuasbleSection/VideosSection';
import CardsSection from '../../components/ReuasbleSection/CardsSection';
import Footer from '../../components/Footer/Footer';
import LoginPage from '../LoginPage/LoginPage';
import SignUpPage from "../SignUpPage/SignUpPage";
import chatting from '../../assets/images/chatting.svg';

const cardsData = [
  {
    imageSrc: 'https://d3rr2gvhjw0wwy.cloudfront.net/uploads/mandators/49581/file-manager/egypt-tours-2021.jpg',
    title: 'Solo Travel Safety',
    description: 'Top tips to stay safe while traveling alone.',
  },
  {
    imageSrc: 'https://arloskye.com/cdn/shop/articles/20_packing_hacks.jpg?v=1732657322&width=1200',
    title: 'Smart Packing',
    description: 'Pack light for your next adventure.',
  },
  {
    imageSrc: 'https://d3rr2gvhjw0wwy.cloudfront.net/uploads/mandators/49581/file-manager/solo-travel-egypt,-travel-to-egypt-alone,-solo-female-travel-egypt.jpg',
    title: 'Best Solo Destinations',
    description: 'Explore top spots for solo travelers.',
  },
  {
    imageSrc: 'https://www.usatoday.com/gcdn/presto/2022/12/02/USAT/e68f9f11-fb78-4644-986d-0ec859de4649-GettyImages-510591722.jpg?crop=6495,3654,x0,y330&width=3200&height=1801&format=pjpg&auto=webp',
    title: 'Making Friends Abroad',
    description: 'Easy ways to meet people while traveling solo.',
  },
  {
    imageSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBVwO-fqZOz5ZY-fESGHkkPBow9IwGl-Qfog&s',
    title: 'Budget Travel Tips',
    description: 'Travel the world without breaking the bank.',
  },
  {
    imageSrc: 'https://c02.purpledshub.com/uploads/sites/47/2023/10/Photography-group-4516-scaled.jpg',
    title: 'Travel Photography Tips',
    description: 'Capture stunning travel photos on the go.',
  },
  {
    imageSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2xMyimeNhjCrEAqQYsdJli3BDDFyvUeWQ5Q&s',
    title: 'Solo Travel Mindset',
    description: 'Adopt the right mindset for a successful solo trip.',
  },
  {
    imageSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStUmT83sjAjXJ9C71h7r2p6MaXwDuWA6dzxA&s',
    title: 'Cultural Etiquette',
    description: 'Learn the basics of respecting local cultures.',
  },
];


function LandingPage() {
  const [showLoginPopup, setShowLoginPopup] = useState(false); // State to control popup visibility
  const [showsignupPopup, setShowsignupPopup] = useState(false);
  const targetSectionRef = useRef(null); 
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
  const handleScrollToTarget = () => {
    if (targetSectionRef.current) {
      targetSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      
      <Header onLoginClick={handleLoginClick}  onSinupClick={handlesignupClick} onExploreClick={handleScrollToTarget}/>

      <LoginPage show={showLoginPopup} onClose={handleClosePopup} /> 
      <SignUpPage show={showsignupPopup} onClose={handleClosePopup} /> 
      <ReusableSection
       ref={targetSectionRef}
        title="Explore Egypt's Wonders"
        description="Experience the breathtaking landscapes and historical landmarks of Egypt."
        images={[
          { src: 'https://www.wayfairertravel.com/hs-fs/hubfs/Imported%20sitepage%20images/simon-berger-boyXZfqpwpU-unsplash_giejym-1.jpg?width=1920&height=590&name=simon-berger-boyXZfqpwpU-unsplash_giejym-1.jpg', alt: 'Image 1' },
          { src: 'https://betamedia.experienceegypt.eg/media/experienceegypt/img/Original/2022/8/7/2022_8_7_18_24_45_511.jpeg', alt: 'Image 2' },
          { src: 'https://cdn.hassanallam.com/app/uploads/2022/03/DJI_0398-Enhanced-NR-2560x1706.jpg', alt: 'Image 3' },
        ]}
        backgroundColor="#fff"
      />

        
      <LeftImagesRightTextSection
      title="Meet Egypt's Expert Local Tour Guides"
      description="Connect with passionate, knowledgeable guides who bring Egypt’s rich history and culture to life."
      images={[
        { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRS2DL1KbicU1Hgotp-nBuPMGTakTbY8XH5zQ&s', alt: 'Guide 1' },
        { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgDOJTtXgAtW8S_6efumgkbZs3Htfo5P_wzA&s', alt: 'Guide 2' },
        { src: 'https://storage.googleapis.com/tblv3_bucket_us/guides/57783/1167524/e95b658c-390e-4a18-bbdc-277cf297f493-IMG-20231224-WA0052.jpg', alt: 'Guide 3' },
      ]}
        reverseLayout={false} 
        background="#17A2B8" 
      />
      
    <OneImageRightTextSection
        title="Your Virtual Tour Guide, 
        Anytime, Anywhere"
        description="Explore Egypt at your own pace with our interactive, AI-powered virtual tour guide."
        images={[
          { src: 'https://botnation.ai/site/wp-content/uploads/2022/01/chatbot-gratuit.jpg', alt: 'Pyramids' },
        ]}
        backgroundColor="#fff"  // Dark background color for this section
      />


       <ReusableSection
        title="Chat Live with Local Tour Guides"
        description="Get real-time answers, advice, and recommendations directly from Egypt’s expert guides."
        images={[
          { src:chatting, alt: 'Image 1' },
          
        ]}
        background="#757272"
      />


       <OneImageRightTextSection
        title="Egypt is breathtaking! From the pyramids to the Nile, every moment feels like a step back in time. The culture, history, and people make it unforgettable!"
        description="– Sophia Carter, Travel Blogger from the USA"
        images={[
          { src: 'https://www.theblondeabroad.com/wp-content/uploads/2019/10/pyramids-of-giza-thumb-712x520.jpg', alt: 'Pyramids' },
        ]}
        backgroundColor="#fff"  // Dark background color for this section
      />

        <VideosSection
          title="Egypt Through Their Eyes"
          description="Explore Egypt through the perspectives of our local guides and travelers."
          videos={[
            'BapSQFJPMM0', // Discover Egypt - Official Tourism Video
            'y6MXuqmxS_o', // Travel Guide to Egypt - Visit Cairo
            'LJKM3pmqsbQ', // Exploring the Pyramids of Egypt
            '-7ijw2b2VO4',
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
