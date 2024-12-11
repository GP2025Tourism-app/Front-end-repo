import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Pagination from "react-bootstrap/Pagination";
import { FaHistory, FaUtensils, FaCocktail, FaMountain, FaMusic, FaShoppingCart, FaSpa, FaSwimmer } from "react-icons/fa"; 
import QuestionnaireNavbar from "../../components/NavBar/Questionnaire";
import "./Questionnaire.css"; 

const Questionnaire = () => {
  const navigate = useNavigate();

  const questions = [
    { 
      id: 1, 
      question: "What kind of experiences are you most interested in? (Select all that apply):", 
      title: "1.Travel Interests", 
      type: "buttons", 
      options: [
        { label: "Historical Sites", icon: <FaHistory /> }, 
        { label: "Food & Culinary Tours", icon: <FaUtensils /> }, 
        { label: "Nightlife", icon: <FaCocktail /> }, 
        { label: "Adventure Activities", icon: <FaMountain /> },
        { label: "Cultural Experiences", icon: <FaMusic /> },
        { label: "Shopping", icon: <FaShoppingCart /> },
        { label: "Relaxation & Wellness", icon: <FaSpa /> },
        { label: "Beaches & Water Sports", icon: <FaSwimmer /> }
      ]
    },
    { 
      id: 2, 
      question: "What time of year do you usually travel? (Select all that apply):", 
      title: "2.Time Preferences", 
      type: "checkbox",
      options: [
        { label: "Summer" }, 
        { label: "Winter" },
        { label: "Spring" },
        { label: "Autumn" }
      ]
    },
    { 
      id: 3, 
      question: "How long are you typical trips?", 
      title: "2.Time Preferences", 
      type: "checkbox", 
      options: [
        { label: "Weekend trips" }, 
        { label: "1-2 weeks" },
        { label: "Longer vacations" }
      ]
    },
    { 
      id: 4, 
      question: "What are your preferred destinations?", 
      title: "2.Time Preferences", 
      type: "checkbox", 
      options: [
        { label: "Cities" }, 
        { label: "Coastal" },
        { label: "Desert landscape" }
      ]
    },
    { 
      id: 5, 
      question: "What time of day do you prefer for activities?", 
      title: "2.Time Preferences", 
      type: "checkbox", 
      options: [
        { label: "Morning" }, 
        { label: "Afternoon" },
        { label: "Evening" }
      ]
    },
    { 
      id: 6, 
      question: "Would you like to explore local gems like unique restaurants, artisan shops, or hidden spots?", 
      title: "3. Interests in Local Experiences", 
      type: "radio", 
      options: [
        { label: "Yes, absolutely!" }, 
        { label: "Maybe, if recommended." },
        { label: "No, not interested." }
      ]
    }
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isIntro, setIsIntro] = useState(true); 

  const toggleSelection = (selectedValue) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = { ...prevAnswers };
      const currentQuestionId = questions[currentQuestionIndex].id;

      if (questions[currentQuestionIndex].type === "checkbox"||questions[currentQuestionIndex].type === "buttons") {
       
        if (!updatedAnswers[currentQuestionId]) {
          updatedAnswers[currentQuestionId] = [];
        }
        const currentSelection = updatedAnswers[currentQuestionId];

        if (!currentSelection.includes(selectedValue)) {
          currentSelection.push(selectedValue);
        }
      } 
      else {
        
        updatedAnswers[currentQuestionId] = selectedValue;
      }

      return updatedAnswers;
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      console.log("User answers:", answers);
      navigate("/"); 
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleStart = () => {
    setIsIntro(false); 
  };

  const handleSkip = () => {
    navigate("/"); 
  };

  const renderOptions = (options) => {
    return options.map((option, index) => {
      if (questions[currentQuestionIndex].type === "buttons") {
      
        return (
          <div key={index} className="badge-option-container">
            <Button
              style={{
                backgroundColor: answers[questions[currentQuestionIndex].id]?.includes(option.label) ? '#17A2B8' : 'white',
                color: answers[questions[currentQuestionIndex].id]?.includes(option.label) ? 'white' : 'black',
                borderColor: '#17A2B8',
              }}
              onClick={() => toggleSelection(option.label)}
              className="badge-option"
            >
              {option.icon} {option.label}
            </Button>
          </div>
        );
      } else if (questions[currentQuestionIndex].type === "checkbox") {
       
        return (
          <Form.Check
            key={index}
            type="checkbox"
            label={option.label}
            checked={answers[questions[currentQuestionIndex].id]?.includes(option.label)}
            onChange={() => toggleSelection(option.label)}
          />
        );
      } else if (questions[currentQuestionIndex].type === "radio") {
        
        return (
          <Form.Check
            key={index}
            type="radio"
            label={option.label}
            checked={answers[questions[currentQuestionIndex].id] === option.label}
            onChange={() => toggleSelection(option.label)}
          />
        );
      }
    });
  };

  return (
    <div className="questionnaire-container">
      <QuestionnaireNavbar />
      <div className="background" />
      <Card className="questionnaire-card">
        <Card.Body>
          {isIntro ? (
            <>
              <Card.Title className="intro-title">Let’s Personalize Your Journey!</Card.Title>
              <Card.Text className="intro-description">
                Take a moment to share your travel preferences so we can create personalized recommendations tailored just for you—whether it's hidden gems, exciting activities, or the perfect spots to relax.
                <br />
                Not ready? No problem, you can skip this step and come back anytime!
              </Card.Text>
              <div className="buttons">
                <Button variant="primary" className="start-button" onClick={handleStart}>Start</Button>
                <Button variant="link" className="skip-button" onClick={handleSkip}>Skip and go back to homepage</Button>
              </div>
            </>
          ) : (
            <>
              <div className="pagination-container">
                <Pagination>
                  <Pagination.Prev onClick={handlePrevious} disabled={currentQuestionIndex === 0} />
                  {[...Array(questions.length)].map((_, index) => (
                    <Pagination.Item 
                      key={index}
                      active={currentQuestionIndex === index}
                      onClick={() => setCurrentQuestionIndex(index)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1} />
                </Pagination>
              </div>
              
              <Card.Title className="card-question-title">{questions[currentQuestionIndex].title}</Card.Title>
              <Card.Subtitle className="question-subtitle">{questions[currentQuestionIndex].question}</Card.Subtitle>
              <Form>
                <div className="options-container">
                  {renderOptions(questions[currentQuestionIndex].options)}
                </div>
              </Form>
              <Button
                variant="primary"
                className="next-button"
                onClick={handleNext}
                disabled={answers[questions[currentQuestionIndex].id]?.length === 0 && questions[currentQuestionIndex].type !== "radio"}
              >
                {currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
              </Button>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Questionnaire;
