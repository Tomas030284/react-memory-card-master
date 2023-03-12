import React, { useState, useEffect } from "react";
import Card from "./components/Card";
import "./App.css";

import { cardsDB } from "./import";

function App() {
  const [cards, setCards] = useState([]);
  const [firstCard, setFirstCard] = useState({});
  const [secondCard, setSecondCard] = useState({});
  const [unflippedCards, setUnflippedCards] = useState([]);
  const [disabledCards, setDisabledCards] = useState([]);
  const [numberSuccesses, setnumberSuccesses] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  };

  // Obtener la posición almacenada en el localStorage
  const scrollPosition = parseInt(localStorage.getItem("scrollPosition")) || 0;

  // Volver a la posición almacenada después de que la página se haya cargado
  useEffect(() => {
    window.scrollTo(0, scrollPosition);
    localStorage.removeItem("scrollPosition");
  }, [scrollPosition]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeElapsed((prevTimeElapsed) => prevTimeElapsed + 1);
    }, 10);
    if (numberSuccesses === 12) {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [numberSuccesses]);

  useEffect(() => {
    shuffleArray(cardsDB);
    setCards(cardsDB);
  }, []);

  useEffect(() => {
    checkForMatch();
  }, [secondCard]);

  const flipCard = (name, number) => {
    if (firstCard.name === name && firstCard.number === number) {
      return 0;
    }
    if (!firstCard.name) {
      setFirstCard({ name, number });
    } else if (!secondCard.name) {
      setSecondCard({ name, number });
    }
    return 1;
  };

  const checkForMatch = () => {
    if (firstCard.name && secondCard.name) {
      const match = firstCard.name === secondCard.name;
      match ? disableCards() : unflipCards();

      match
        ? setnumberSuccesses(numberSuccesses + 2)
        : setnumberSuccesses(numberSuccesses);
    }
  };

  const disableCards = () => {
    setDisabledCards([firstCard.number, secondCard.number]);
    resetCards();
  };

  const unflipCards = () => {
    setUnflippedCards([firstCard.number, secondCard.number]);
    resetCards();
  };

  const resetCards = () => {
    setFirstCard({});
    setSecondCard({});
  };

  function reloadPage() {
    // Almacenar la posición actual de la ventana en el localStorage
    localStorage.setItem("scrollPosition", window.scrollY.toString());
    // Recargar la página
    window.location.reload();
  }

  return (
    <div className="cards-container">
      {cards &&
        cards.map((card, index) => (
          <Card
            key={card.id}
            name={card.name}
            number={index}
            frontFace={card.face}
            flipCard={flipCard}
            unflippedCards={unflippedCards}
            disabledCards={disabledCards}
          />
        ))}
      <h3>
        <strong>
          <p>Tiempo transcurrido (Segundos): {timeElapsed / 100}</p>
        </strong>
      </h3>
      <button onClick={reloadPage}>Recargar</button>
    </div>
  );
}
export default App;
