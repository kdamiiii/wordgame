function getUniqueRandomWords(sourceArray, n) {
    // Check if n is valid
    if (n > sourceArray.length) {
        throw new Error('Requested number of unique words exceeds the length of the source array.');
    }
    
    // Check if color distribution is valid
    if (n < 18) {
        throw new Error('Insufficient number of items for the specified color distribution.');
    }

    // Define the color distribution
    const colorDistribution = ['blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', // 9 blues
                               'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red',                // 8 reds
                               'black',                                                                        // 1 black
                               ...Array(n - 18).fill('neutral')];                                             // Remaining neutrals
    
    // Shuffle the color distribution array
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // Shuffle the colors
    const shuffledColors = shuffle(colorDistribution);

    // Create a copy of the source array to avoid modifying the original array
    let arrayCopy = [...sourceArray];
    
    // Array to hold the selected unique words with colors
    let resultArray = [];
    
    // Function to get a random index
    function getRandomIndex(max) {
        return Math.floor(Math.random() * max);
    }
    
    // Select n unique random words
    for (let i = 0; i < n; i++) {
        // Get a random index
        let randomIndex = getRandomIndex(arrayCopy.length);
        
        // Remove the word at the random index
        let selectedWord = arrayCopy.splice(randomIndex, 1)[0];
        
        // Assign a color from the shuffled colors
        let color = shuffledColors[i];
        
        // Add the word with its color to the result array
        resultArray.push({ name: selectedWord, color: color, viewed:false });
    }
    
    return resultArray;
}

const createCard  = (text, color, visible, viewed) =>{
    const newDiv = document.createElement('div');

    // 2. Set some attributes or content
    newDiv.id = text; // Set an id attribute
    newDiv.className = 'card'; // Set a class attribute
    newDiv.textContent = text; 

    const colors = colorCheck(color);

    if(visible || viewed){
        newDiv.style.backgroundColor = colors.bgColor;
        newDiv.style.color = colors.fontColor;

        if(viewed){
            newDiv.style.backgroundImage = `url('../imgs/${color}.png')`;
            newDiv.style.backgroundPosition = "center";
            newDiv.style.backgroundSize ="contain"
            newDiv.style.backgroundRepeat = "no-repeat"
        }
    }
    else{
        newDiv.style.backgroundColor = "#d9c1a5";
        newDiv.style.color = "#8c6e49";
    }
    return newDiv;
}

const colorCheck = (color) => {
    switch(color){
        case 'red':
            return {bgColor:"#a83232", fontColor:"#FFFFFF"}
        case 'blue':
            return {bgColor:"#3e64de", fontColor:"#FFFFFF"}
        case 'neutral':
            return {bgColor:"#d9c1a5", fontColor:"#8c6e49"}
        case 'black':
            return {bgColor:"#000000", fontColor:"FFFFFF"}
    }
}

function generateRandomHash(length) {
    const characters = '0123456789abcdef';
    let hash = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        hash += characters[randomIndex];
    }
    return hash;
}

function containsStringInValues(obj, searchString) {
    // Iterate over each value in the object
    for (const value of Object.values(obj)) {
        // Check if the value is a string and contains the search string
        if (typeof value === 'string' && value.includes(searchString)) {
            return true;
        }
    }
    // Return false if the search string was not found in any values
    return false;
}

function findSpyMaster(obj, team) {
    // Iterate over each value in the object
    for (const value of Object.values(obj)) {
        // Check if the value is a string and contains the search string
        if (typeof value === 'string' && value.includes(`${team}-spymaster`)) {
            return value;
        }
    }
    // Return false if the search string was not found in any values
    return false;
}

function generateTurns(players){


    const blueSpymaster = Object.keys(players).find(name => players[name] === 'blue-spymaster');
    const redSpymaster = Object.keys(players).find(name => players[name] === 'red-spymaster');

    const blueMembers = Object.keys(players).filter(name => players[name] === 'blue');
    const redMembers = Object.keys(players).filter(name => players[name] === 'red');
    
    // Step 2: Create the array with the specified order
    const result = [];
    const maxMembers = Math.max(blueMembers.length, redMembers.length);
    
    for (let i = 0; i < maxMembers; i++) {
        if (blueSpymaster) {
            result.push(blueSpymaster);
        }
        if (i < blueMembers.length) {
            result.push(blueMembers[i]);
        }

        if (redSpymaster) {
            result.push(redSpymaster);
        }
        if (i < redMembers.length) {
            result.push(redMembers[i]);
        }
    }

    return result;
}

function getRandomColor() {
    const colors = ['red', 'blue'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

function checkSpymasters(players) {
    const hasBlueSpymaster = Object.values(players).includes('blue-spymaster');
    const hasRedSpymaster = Object.values(players).includes('red-spymaster');

    return hasBlueSpymaster && hasRedSpymaster;
}

function assignRoles(players) {
    // Convert the players object to an array of player names
    let playerNames = Object.keys(players);

    // Shuffle the player names
    playerNames = playerNames.sort(() => Math.random() - 0.5);

    const totalPlayers = playerNames.length;
    const roles = [];
    
    // Determine the number of red and blue players
    const half = Math.floor(totalPlayers / 2);
    
    // Add roles for the remaining players
    for (let i = 0; i < half; i++) {
        roles.push('red');
        roles.push('blue');
    }

    // If there's an odd number of players, randomly assign the last one
    if (totalPlayers % 2 !== 0) {
        roles.push(Math.random() > 0.5 ? 'red' : 'blue');
    }
    
    // Shuffle the roles to randomize their order
    roles.sort(() => Math.random() - 0.5);
    
    // Assign the roles to the players
    const assignedRoles = {};
    playerNames.forEach((player, index) => {
        assignedRoles[player] = roles[index];
    });

    return assignedRoles;
}

function createUserHints(viewers, players){
    console.log(players)
    const viewerContainer = document.createElement('div');
    viewerContainer.className = 'badge-container'
    for(let v in viewers){
        const color = players[viewers[v]].includes('red') ? 'bg-danger' : 'bg-primary';
        const viewer = document.createElement('span');
        viewer.className = `badge ${color} badge-class`;
        viewer.innerText = viewers[v];
        viewerContainer.appendChild(viewer);
    }
    return viewerContainer
}