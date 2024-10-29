const colors = [
  { name: 'Red', hex: '#FF0000', sound: 'sounds/red.mp3', image: 'img/red.jpeg' },
  { name: 'Blue', hex: '#0000FF', sound: 'sounds/blue.mp3', image: 'img/blue.jpeg' },
  { name: 'Green', hex: '#008000', sound: 'sounds/green.mp3', image: 'img/green.jpeg' },
  { name: 'Yellow', hex: '#FFFF00', sound: 'sounds/yellow.mp3', image: 'img/yellow.jpeg' },
  { name: 'Purple', hex: '#800080', sound: 'sounds/purple.mp3', image: 'img/purple.jpeg' },
  { name: 'Orange', hex: '#FFA500', sound: 'sounds/orange.mp3', image: 'img/orange.jpeg' },
  { name: 'Pink', hex: '#FFC0CB', sound: 'sounds/pink.mp3', image: 'img/pink.jpeg' },
  { name: 'Brown', hex: '#A52A2A', sound: 'sounds/brown.mp3', image: 'img/brown.jpeg' },
  { name: 'Black', hex: '#000000', sound: 'sounds/black.mp3', image: 'img/black.jpeg' },
  { name: 'White', hex: '#FFFFFF', sound: 'sounds/white.mp3', image: 'img/white.jpeg' }
];

let correctColor = null; // Inicializar como null para evitar undefined
let selectedColor;

// Función para reproducir un sonido
function playSound(filePath) {
  const audio = new Audio(filePath);
  audio.play().catch(error => {
    console.log('Audio playback was prevented: ', error);
  });
}

// Modifica la función randomizeColors para incluir las imágenes
function randomizeColors() {
  if (!correctColor) {
    console.error('No se ha seleccionado un color correcto');
    return;
  }

  let shuffledColors = [...colors].filter(color => color.name !== correctColor.name);
  shuffledColors = shuffledColors.sort(() => 0.5 - Math.random()).slice(0, 2);

  shuffledColors.push(correctColor);
  const finalColors = shuffledColors.sort(() => 0.5 - Math.random());

  const colorBoxes = document.querySelectorAll('.color-box');
  colorBoxes.forEach((box, index) => {
    box.style.backgroundColor = finalColors[index].hex;
    box.dataset.colorName = finalColors[index].name;

    // Agregar la imagen correspondiente al color
    const img = box.querySelector('.color-image');
    img.src = finalColors[index].image;
    img.alt = finalColors[index].name;
  });
}

// Función que muestra la instrucción del color a seleccionar
function showInstruction() {
  correctColor = colors[Math.floor(Math.random() * colors.length)]; // Selecciona el color correcto
  document.getElementById('instruction').textContent = `Find the color: ${correctColor.name}`;
  document.getElementById('instruction').style.visibility = 'visible';

  // Reproducir el sonido del color a seleccionar
  playSound(correctColor.sound);
}

// Función de la ruleta que dura 5 segundos
function startColorRoulette() {
  let intervalId = setInterval(() => {
    const randomColors = [...colors].sort(() => 0.5 - Math.random()).slice(0, 3);
    const colorBoxes = document.querySelectorAll('.color-box');

    colorBoxes.forEach((box, index) => {
      box.style.backgroundColor = randomColors[index].hex;
    });
  }, 200);

  setTimeout(() => {
    clearInterval(intervalId);
    showInstruction(); // Asegurar que se elige el color correcto aquí
    randomizeColors();  // Mostrar colores con la garantía de que uno sea el correcto
  }, 5000);
}

// Función para verificar si el jugador ha elegido el color correcto
function checkSelection(event) {
  // Asegurarnos de que el clic es en una casilla de color válida
  const box = event.target.closest('.color-box');  // Esto busca el ancestro más cercano con la clase .color-box
  if (!box) return; // Si no es una casilla de color, no hacemos nada

  selectedColor = box.dataset.colorName;
  const resultText = document.getElementById('result');

  if (selectedColor === correctColor.name) {
    resultText.textContent = "CONGRATULATIONS! You selected the correct color!";
    resultText.style.color = 'green';

    // Reproducir sonido de "CONGRATULATIONS"
    playSound('sounds/congratulations.mp3');
  } else {
    resultText.textContent = "NO! Try again!";
    resultText.style.color = 'red';

    // Reproducir sonido de "NO"
    playSound('sounds/no.mp3');
  }

  resultText.style.visibility = 'visible';

  setTimeout(() => {
    resultText.style.visibility = 'hidden';

    // Si acierta, iniciar una nueva ronda
    if (selectedColor === correctColor.name) {
      startColorRoulette();
    }
  }, 3000);
}

// Función para iniciar el juego cuando se presiona el botón Start
function startGame() {
  document.getElementById('startButton').style.display = 'none'; // Ocultar el botón de inicio
  document.querySelector('.color-box-container').style.display = 'flex'; // Mostrar las casillas de colores
  startColorRoulette();
  document.querySelectorAll('.color-box').forEach(box => {
    box.addEventListener('click', checkSelection);
  });
}

// Asignar evento al botón de Start
document.getElementById('startButton').addEventListener('click', startGame);
