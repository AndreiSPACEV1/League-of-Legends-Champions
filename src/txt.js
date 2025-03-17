import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";


let champions = [];
let eliminatedChampions = new Set();
let pickedChampion = null; // Campionul ales random

function loadEliminatedChampions() {
  const saved = localStorage.getItem("eliminatedChampions");
  if (saved) {
    eliminatedChampions = new Set(JSON.parse(saved));
  }
}

function saveEliminatedChampions() {
  localStorage.setItem(
    "eliminatedChampions",
    JSON.stringify([...eliminatedChampions])
  );
}

async function fetchChampions() {
  const version = "14.5.1"; // Versiunea curentă
  const response = await fetch(
    `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`
  );
  const data = await response.json();
  champions = Object.values(data.data).filter(
    (champion) => !eliminatedChampions.has(champion.id)
  );
  displayChampions();
}

function displayChampions() {
  const container = document.getElementById("champion-list");
  container.innerHTML = "";
  champions.forEach((champion, index) => {
    const div = document.createElement("div");
    div.className = "champion";
    div.style.animationDelay = `${index * 0.05}s`;
    div.innerHTML = `
      <img src="https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/${champion.image.full}" alt="${champion.name}">
      <p>${champion.name}</p>
    `;
    container.appendChild(div);
  });
}

function pickRandomChampion() {
  if (champions.length === 0) {
    alert("Nu mai sunt campioni disponibili!");
    return;
  }
  const index = Math.floor(Math.random() * champions.length);
  pickedChampion = champions.splice(index, 1)[0]; // Elimină campionul selectat
  eliminatedChampions.add(pickedChampion.id);
  saveEliminatedChampions();

  // Afișează overlay cu detaliile campionului
  document.getElementById("overlay-icon").src = `https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/${pickedChampion.image.full}`;
  document.getElementById("overlay-name").textContent = pickedChampion.name;
  document.getElementById("overlay").style.display = "flex";
}

function keepChampion() {
  // Păstrează campionul
  alert(`Campionul ${pickedChampion.name} a fost păstrat!`);
  document.getElementById("overlay").style.display = "none";
  displayChampions();
}

function removeChampion() {
  // Elimină campionul
  alert(`Campionul ${pickedChampion.name} a fost eliminat!`);
  pickedChampion = null;
  document.getElementById("overlay").style.display = "none";
  displayChampions();
}

function resetChampions() {
  eliminatedChampions.clear();
  localStorage.removeItem("eliminatedChampions"); // Șterge datele salvate
  fetchChampions();
}

loadEliminatedChampions();
fetchChampions();



const App = () => {

  return (
    <div>
    
    
    <h1>League of Legends Champions</h1>
  <button onclick="pickRandomChampion()">Alege Campion Aleatoriu</button>
  <button onclick="resetChampions()">Resetează Lista</button>
  <div id="champion-list"></div>

  <div id="overlay" class="overlay" style="display: none;">
    <div class="overlay-content">
      <img id="overlay-icon" src="" alt="Champion Icon" />
      <h2 id="overlay-name"></h2>
      <button onclick="keepChampion()">Păstrează</button>
      <button onclick="removeChampion()">Elimină</button>
    </div>
  </div>


    </div>
  );
};

export default App;
