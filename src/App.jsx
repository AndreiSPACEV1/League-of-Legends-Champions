import { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [champions, setChampions] = useState([]);
  const [eliminatedChampions, setEliminatedChampions] = useState(new Set());
  const [pickedChampion, setPickedChampion] = useState(null);
  const [overlayVisible, setOverlayVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("eliminatedChampions");
    if (saved) {
      setEliminatedChampions(new Set(JSON.parse(saved)));
    }
    fetchChampions();
  }, []);

  const fetchChampions = async () => {
    const version = "14.5.1";
    const response = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`
    );
    const data = await response.json();
    const availableChampions = Object.values(data.data).filter(
      (champion) => !eliminatedChampions.has(champion.id)
    );
    setChampions(availableChampions);
  };

  const pickRandomChampion = () => {
    if (champions.length === 0) {
      alert("Nu mai sunt campioni disponibili!");
      return;
    }
    const index = Math.floor(Math.random() * champions.length);
    const chosenChampion = champions.splice(index, 1)[0];
    eliminatedChampions.add(chosenChampion.id);
    setPickedChampion(chosenChampion);
    setEliminatedChampions(new Set(eliminatedChampions)); // update the state
    localStorage.setItem("eliminatedChampions", JSON.stringify([...eliminatedChampions]));
    setOverlayVisible(true);
  };

  const keepChampion = () => {
    alert(`Campionul ${pickedChampion.name} a fost păstrat!`);
    setOverlayVisible(false);
  };

  const removeChampion = () => {
    alert(`Campionul ${pickedChampion.name} a fost eliminat!`);
    setPickedChampion(null);
    setOverlayVisible(false);
    fetchChampions();
  };

  const resetChampions = () => {
    setEliminatedChampions(new Set());
    localStorage.removeItem("eliminatedChampions");
    fetchChampions();
  };

  return (
    <div>
      <h1>League of Legends Champions</h1>
      <button onClick={pickRandomChampion}>Alege Campion Aleatoriu</button>
      <button onClick={resetChampions}>Resetează Lista</button>
      <div id="champion-list">
        {champions.map((champion, index) => (
          <div key={champion.id} className="champion" style={{ animationDelay: `${index * 0.05}s` }}>
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/${champion.image.full}`}
              alt={champion.name}
            />
            <p>{champion.name}</p>
          </div>
        ))}
      </div>

      {overlayVisible && pickedChampion && (
        <div id="overlay" className="overlay" style={{ display: "flex" }}>
          <div className="overlay-content">
            <img
              id="overlay-icon"
              src={`https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/${pickedChampion.image.full}`}
              alt="Champion Icon"
            />
            <h2 id="overlay-name">{pickedChampion.name}</h2>
            <button onClick={keepChampion}>Păstrează</button>
            <button onClick={removeChampion}>Elimină</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
