let currentMap = '';
let currentRound = 0;
let yourTeamScore = 0;
let enemyTeamScore = 0;
let currentPlayerSide = '';  // Keeps track of the current side (Defender or Attacker)
let maxRoundsPerSide = 12;  // Maximum rounds per side

function startGame(mapName) {
  currentMap = mapName;
  currentRound = 0;
  yourTeamScore = 0;
  enemyTeamScore = 0;
  document.getElementById('map-selection').style.display = 'none';
  document.getElementById('game').style.display = 'block';
  askSide();  // Start by asking for the side
}

function goBack() {
    document.getElementById('map-selection').style.display = 'block';
    document.getElementById('game').style.display = 'none';
  
    // Reset the scores
    yourTeamScore = 0;
    enemyTeamScore = 0;
  
    // Update the score display
    updateScoreDisplay();
  }

  function askSide() {
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = `
      <h2>Which side are you on?</h2>
      <button onclick="playRound('Defenders')" class="button">Defender</button>
      <button onclick="playRound('Attackers')" class="button">Attacker</button>
    `;
  
    // Reset the current player side when asking for side
    currentPlayerSide = '';
    updateSideTitle();
  }
  

function playRound(side) {
  if (currentPlayerSide === '') {
    currentPlayerSide = side;
    updateSideTitle();  // Update the side title after choosing a side
  }

    // Get suggestions based on the selected map and side
    const suggestion = getSuggestions(currentMap, currentPlayerSide);
    document.getElementById('suggestion').innerText = 'Try: ' + suggestion;

  if (currentRound < maxRoundsPerSide) {
    currentRound++;
    // alert(`Playing round ${currentRound} on ${currentMap}, side: ${side}`);
    askRoundOutcome();  // Ask for the round outcome
  } else {
    // Switch sides after max rounds for one side
    switchSides();
  }
}

function calculateStackCounts(numSites, maxTeammates) {
    const stackCounts = {};
    let remainingTeammates = maxTeammates;
  
    for (let i = 0; i < numSites; i++) {
      const siteLetter = String.fromCharCode(65 + i); // Convert 0, 1, 2 to A, B, C
      if (i === numSites - 1) {
        stackCounts[`Site ${siteLetter}`] = remainingTeammates; // Assign remaining teammates to the last site
      } else {
        // Randomly allocate teammates to each site
        const randomTeammates = Math.floor(Math.random() * (remainingTeammates + 1));
        stackCounts[`Site ${siteLetter}`] = randomTeammates;
        remainingTeammates -= randomTeammates;
      }
    }
  
    return stackCounts;
  }
  
  function getSuggestions(map, side) {
    let suggestions = '';
  
    if (map === 'Haven' || map === 'Lotus') {
      if (side === 'Defenders') {
        const numSites = 3; // Haven and Lotus have 3 sites
        const maxTeammates = 5;
  
        const stackCounts = calculateStackCounts(numSites, maxTeammates);
  
        suggestions = `Stack ${Object.entries(stackCounts)
          .map(([site, count]) => `${count} on ${site}`)
          .join(', ')}.`;
      } else if (side === 'Attackers') {
        const sites = ['A', 'B', 'C'];
        const randomSite = sites[Math.floor(Math.random() * sites.length)];
        suggestions = `Consider hitting site ${randomSite}.`;
      }
    } else if (map === 'Split' || map === 'Bind' || map === 'Ascent' || map === 'Sunset' || map === 'Breeze') {
        if (side === 'Defenders') {
            const numSites = 2; // Haven and Lotus have 3 sites
            const maxTeammates = 5;
    
            const stackCounts = calculateStackCounts(numSites, maxTeammates);
    
            suggestions = `Stack ${Object.entries(stackCounts)
            .map(([site, count]) => `${count} on ${site}`)
            .join(', ')}.`;
        } else if (side === 'Attackers') {
            const sites = ['A', 'B'];
            const randomSite = sites[Math.floor(Math.random() * sites.length)];
            suggestions = `Hitting site ${randomSite}.`;
          }
    }
  
    return suggestions;
  }

function updateSideTitle() {
    const sideTitle = document.getElementById('side-title');
    if (sideTitle) {
        sideTitle.innerText = `Current Side: ${currentPlayerSide}`;
    }
}

function switchSides() {
  if (currentPlayerSide === 'Defenders') {
    currentPlayerSide = 'Attackers';
  } else {
    currentPlayerSide = 'Defenders';
  }

  currentRound = 0;  // Reset the round count
  document.getElementById('side-title').innerText = `Current Side: ${currentPlayerSide}`;
//   alert(`Switching sides! Now playing as ${currentPlayerSide} on ${currentMap}`);
  askSide();  // Ask for the side again for the next round
}

function askRoundOutcome() {
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = `
      <h2>Did you win this round? (Round ${currentRound}/${maxRoundsPerSide})</h2>
      <p>Current Side: ${currentPlayerSide}</p>
      <button onclick="roundOutcome(true)">Yes</button>
      <button onclick="roundOutcome(false)">No</button>
    `;
  }

function updateScoreDisplay() {
    const scoreDisplay = document.getElementById('score-display');
    scoreDisplay.innerText = `Your Team: ${yourTeamScore} | Enemy Team: ${enemyTeamScore}`;
  }
  
function roundOutcome(youWin) {
    if (youWin) {
        yourTeamScore++;
        // Update the score display
        updateScoreDisplay();
    } else {
        enemyTeamScore++;
        // Update the score display
        updateScoreDisplay();
        // alert('Run it down A site');
    }

    if (yourTeamScore === 13 || enemyTeamScore === 13) {
        endGame();
      } else if (currentRound + 1 < maxRoundsPerSide) {
        playRound(currentPlayerSide);  // Start the next round
      } else {
        switchSides();  // Switch sides after max rounds for one side
        updateScoreDisplay();  // Update the score display after switching sides
      }
}

function endGame() {
    const gameContainer = document.getElementById('game');
    if (enemyTeamScore === 13) {
        gameContainer.innerHTML = `
        <h1>Sheesh!</h1>
        <p>The game has ended. Your Team: ${yourTeamScore} | Enemy Team: ${enemyTeamScore}</p>
        <button onclick="goBack()">Back to Map Selection</button>
        `;
    } else {
        gameContainer.innerHTML = `
        <h1>Congratulations!</h1>
        <p>The game has ended. Your Team: ${yourTeamScore} | Enemy Team: ${enemyTeamScore}</p>
        <button onclick="goBack()">Back to Map Selection</button>
        `;
    }

    // Reset the scores
    yourTeamScore = 0;
    enemyTeamScore = 0;
    updateScoreDisplay();
  }
  
  