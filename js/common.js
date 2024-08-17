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

function setWordViewersToNull(words, name){
    return words.map((wordie)=>{
        wordie.viewers = null;
        if(wordie.name == name){
            wordie.viewed = true;
        }
        return wordie
    })
}

function drawCards(playerData, turn, gameData, playerRole, words, visible, announcement, update, cardsContainer, db, hash, ref, get, playerName){
    document.body.style.backgroundColor = turn == 
    'blue' ? '#213268' : '#662727';
    const opponent = turn == 'blue' ? 'red' : 'blue';
    if(gameData.clue){
        announcement.innerHTML = `${turn.toUpperCase()} TEAM is Guessing! CLUE: ${gameData.clue} [${gameData.clueCount}]`;
        if(playerRole == turn){
            for(let i in words){
                const newDiv = createCard(words[i].name, words[i].color, visible, words[i].viewed);
                
                if(!words[i].viewed){
                    const button = document.createElement('button');
                    button.className = 'btn btn-success';
                    button.innerText = "Select";
                    
                    button.onclick = function(){
                        const action = {
                            type:'select',
                            player:playerName,
                            word: words[i].name,
                            wordColor: words[i].color,
                            team: turn
                        }
                        let updates = null;
                        if(words[i].color == turn){
                            let clueCount = gameData.clueCount - 1;
                            const nextTurn = clueCount < 1 ? opponent : turn;
                            const turnScore = gameData[`${turn}Cards`] - 1;

                            let clue = clueCount < 1? null : gameData.clue;

                            updates = {
                                [`lobbies/${hash}/gameStatus/clue/`]:clue,
                                [`lobbies/${hash}/gameStatus/clueCount/`]:clueCount,
                                [`lobbies/${hash}/gameStatus/turn/`]:nextTurn,
                                [`lobbies/${hash}/gameStatus/${turn}Cards/`]:turnScore,
                                [`lobbies/${hash}/gameStatus/words`]: setWordViewersToNull(words, words[i].name),
                                [`lobbies/${hash}/gameStatus/logs`]: [...gameData.logs, action] 
                            }

                            if(turnScore == 0) {
                                addPlayerScore(playerData, get, turn, update, ref, db);
                            }
                        }
                        else if(words[i].color == 'neutral'){
                            updates = {
                                [`lobbies/${hash}/gameStatus/clue/`]:null,
                                [`lobbies/${hash}/gameStatus/clueCount/`]:null,
                                [`lobbies/${hash}/gameStatus/turn/`]:opponent,
                                [`lobbies/${hash}/gameStatus/words`]: setWordViewersToNull(words, words[i].name),
                                [`lobbies/${hash}/gameStatus/logs`]: [...gameData.logs, action] 
                            }
                        }
                        else if(words[i].color == 'black'){
                            updates = {
                                [`lobbies/${hash}/gameStatus/clue/`]:null,
                                [`lobbies/${hash}/gameStatus/clueCount/`]:null,
                                [`lobbies/${hash}/gameStatus/turn/`]:opponent,
                                [`lobbies/${hash}/gameStatus/${opponent}Cards/`]:0,
                                [`lobbies/${hash}/gameStatus/words`]: setWordViewersToNull(words, words[i].name),
                                [`lobbies/${hash}/gameStatus/logs`]: [...gameData.logs, action] 
                            }

                            addPlayerScore(playerData, get, opponent, update, ref, db);
                        }
                        else {
                            const turnScore = gameData[`${opponent}Cards`] - 1;

                            updates = {
                                [`lobbies/${hash}/gameStatus/clue/`]:null,
                                [`lobbies/${hash}/gameStatus/clueCount/`]:null,
                                [`lobbies/${hash}/gameStatus/turn/`]:opponent,
                                [`lobbies/${hash}/gameStatus/${opponent}Cards/`]:turnScore,
                                [`lobbies/${hash}/gameStatus/words`]: setWordViewersToNull(words, words[i].name),
                                [`lobbies/${hash}/gameStatus/logs`]: [...gameData.logs, action] 
                            }

                            if(turnScore == 0) {
                                addPlayerScore(playerData, get, opponent, update, ref, db);
                            }
                        }
                        update(ref(db), updates);
                    }
                    newDiv.appendChild(button);
                }

                newDiv.onclick = function(){
                    if(!words[i].viewed){
                        if(words[i].viewers && words[i]?.viewers.includes(playerName)){
                            let updatedViewers = words[i].viewers.filter(item => item !== playerName);
                            const updates = {
                                [`lobbies/${hash}/gameStatus/words/${i}/viewers`] : updatedViewers
                            }
                            update(ref(db), updates);
                        }
                        else if(words[i].viewers == null){

                            const updates = {
                                [`lobbies/${hash}/gameStatus/words/${i}/viewers`] : [playerName]
                            }
                            update(ref(db), updates);
                        }
                        else{
                            const updates = {
                                [`lobbies/${hash}/gameStatus/words/${i}/viewers`] : [...words[i].viewers, playerName]
                            }
                            update(ref(db), updates);
                        }
                    }
                }

                if(!words[i].viewed){
                    newDiv.appendChild(createUserHints(words[i].viewers, playerData));
                }

                cardsContainer.appendChild(newDiv);
            }
        }
        else{
            for(let i in words){
                const newDiv = createCard(words[i].name, words[i].color, visible, words[i].viewed);
                newDiv.appendChild(createUserHints(words[i].viewers, playerData));
                cardsContainer.appendChild(newDiv);
            }
        }
    }
    else{
        if(playerRole == `${turn}-spymaster`){
            for(let i in words){
                cardsContainer.appendChild(createCard(words[i].name, words[i].color, visible, words[i].viewed))
            }

            const container = document.createElement('div');
            container.className = 'input-container';
            // container.style.width = '40%';

            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'form-control-lg';
            input.id = 'clue-input';
            input.maxLength = 20;

            const numberInput = document.createElement('input');
            numberInput.id = 'number-input-dog'
            numberInput.type = 'number';
            numberInput.className = 'form-control-lg number-input';
            numberInput.max=10;
            numberInput.min=1;

            // Append the outer div to the body (or another container element)
            const labelll = document.createElement('h4');
            labelll.innerText = 'CLUE:'
            labelll.style.color = 'white'
            container.appendChild(labelll);
            container.appendChild(input);

            const numberContainer = document.createElement('div');
            numberContainer.className = 'input-container';
            numberContainer.style.width = '10em !important';

            numberContainer.appendChild(numberInput);

            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'btn btn-success';
            button.innerText = 'Confirm'
            button.style.height = '100%'

            button.onclick = function(){
                const num = document.getElementById('number-input-dog').value;
                const textinput = document.getElementById('clue-input').value;
                if(num && textinput){
                    const action = {
                        type:'clue',
                        player:playerName,
                        word: textinput,
                        team: turn,
                        wordCount: num
                    }
                    const updates = {
                        [`lobbies/${hash}/gameStatus/clue`]:textinput,
                        [`lobbies/${hash}/gameStatus/clueCount`]: num,
                        [`lobbies/${hash}/gameStatus/logs`]: 
                        gameData.logs ? [...gameData.logs, action] : [action] 
                    }
                    update(ref(db), updates);
                }
                else{
                    alert('Missing inputs');
                }
            }

            document.getElementById('player-options').appendChild(container);
            document.getElementById('player-options').appendChild(numberContainer);
            document.getElementById('player-options').appendChild(button);
        }
        else{
            announcement.innerHTML = `${turn.toString() .toUpperCase()} SPYMASTER is giving a clue`
            for(let i in words){
                const newDiv = createCard(words[i].name, words[i].color, visible, words[i].viewed);
                // newDiv.appendChild(createUserHints(words[i].viewers), playerData);
                cardsContainer.appendChild(newDiv);
            }
        }
    }
}

function showWinner(winnerColor, words, cardsContainer){
    document.body.style.backgroundColor = winnerColor == 'blue' ? '#213268' : '#662727';
    const winner = document.createElement('div');
    winner.className = 'winner';
    winner.innerText = `${winnerColor.toUpperCase()} TEAM WINS!`
    announcement.appendChild(winner);
    for(let i in words){
        const newDiv = createCard(words[i].name, words[i].color, true, words[i].viewed);
        cardsContainer.appendChild(newDiv);
    }
    const endButton = document.getElementById('leaveMatch');
    endButton.style.display = 'flex';

    endButton.onclick = function(){
        localStorage.removeItem('lobbyHash');
        update(ref(db), {
            ['lobbies/'+hash+'/players']: playerData.filter((player)=>player!==playerName)
        })
        const baseUrl = window.location.href.replace('game-start.html','lobbies.html');
        const newUrl = `${baseUrl}`;
        window.location.href = newUrl;
    }
}


function addPlayerScore(playerData, get, winner, update, ref,db) {
    let updates = {}
    const accountsRef = ref(db, 'accounts');
    get(accountsRef).then((accountsSnapshot)=>{
        const accounts = accountsSnapshot.val();
        for(let player in playerData) {
            if(playerData[player].includes(winner)){
                if(playerData[player].includes('spymaster')){
                    updates[`accounts/${player}/winsAsSpy`] = accounts[player].winsAsSpy + 1;
                }
                else {
                    updates[`accounts/${player}/winsAsPlayer`] = accounts[player].winsAsPlayer + 1;
                }
            }
            else{
                if(playerData[player].includes('spymaster')){
                    updates[`accounts/${player}/losesAsSpy`] = accounts[player].losesAsSpy + 1;
                }
                else {
                    updates[`accounts/${player}/losesAsPlayer`] = accounts[player].losesAsPlayer + 1;
                }
            }
        }
        
        update(ref(db), updates);
    })
}
