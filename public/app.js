document.addEventListener('DOMContentLoaded', async () => {
    let web3;
    let contract;
    let currentUser = null;
    const userStrategies = {
        "demoUser": [
            {
                strategyName: "Pfizer Iron Condor",
                strategyDescription: "This is an Iron Condor strategy implemented on PFE. Given X, Y, and Z, I believe that Pfizer will see low volatility in the future. This strategy will profit in the event that Pfizer sees low volitility in the future",
                components: "Long Call - $110 strike, Short Call - $105 strike, Long Put - $90 strike, Short Put - $95 strike",
                targetInvestment: 5000,
                currentInvestment: 1000,
                imageURL: "/ironcondor.png"
            },
            {
                strategyName: "TSLA Bull Call Spread",
                strategyDescription: "I am bullish on Tesla, but not extremely bullish.  For this reason, I am proposing a bull call spread to see returns if the stock price increase, but limit losses in the event that it decreases in value",
                components: "Long Call - $255 strike, Short Call - $265 strike" ,
                targetInvestment: 15000,
                currentInvestment: 7500,
                imageURL: "/bullcallspread.png"
            },
            {
                strategyName: "AAPL Straddle",
                strategyDescription: "Straddle strategy implemented on AAPL",
                components: "X, Y, Z",
                targetInvestment: 20000,
                currentInvestment: 10000,
                imageURL: "/straddle.png"
            }
        ]
    };


    // Initialize Web3 and connect to MetaMask
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            // TODO: Replace with your contract's ABI and Address
            const contractAddress = '0xf8e81D47203A594245E36C48e151709F0C19fBe8';
            const contractABI = [
	{
		"inputs": [],
		"name": "contribute",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "distributeReturns",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "contributions",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "fundingGoal",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "returnPercentage",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalContributed",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
        contract = new web3.eth.Contract(contractABI, contractAddress);

        // Handle account changes
        window.ethereum.on('accountsChanged', function (accounts) {
            // Handle the new accounts, or reload the page
            currentUser = accounts[0];
            console.log('Accounts changed:', accounts);
            // Optionally, refresh the user interface
        });

        // Handle network changes
            window.ethereum.on('chainChanged', (chainId) => {
                console.log('Chain changed:', chainId);
                // Optionally, refresh the page for the new network
            });
        } catch (error) {
            console.error("User denied account access or error occurred:", error);
        }
    } else {
        console.log('MetaMask is not installed');
    }


    // DOM elements
    const loginForm = document.getElementById('loginForm');
    const createStrategyForm = document.getElementById('createStrategyForm');
    const strategiesList = document.getElementById('strategiesList');
    const userProfile = document.getElementById('userProfile');
    const strategyDetails = document.getElementById('strategyDetails');
    const strategySection = document.getElementById('strategySection');
    const createStrategyContainer = document.getElementById('createStrategyContainer');

    // Event Listeners
    document.getElementById('toggleCreateStrategyForm').addEventListener('click', () => {
        createStrategyContainer.style.display = createStrategyContainer.style.display === 'none' ? 'block' : 'none';
    });


    loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    currentUser = document.getElementById('username').value;

    if (!currentUser) {
        console.log('No username entered'); // Debugging log
        return; // Exit if no username
    }

    console.log('Logging in:', currentUser); // Debugging log
    document.getElementById('loginSection').style.display = 'none';
    strategySection.style.display = 'block';
    strategiesList.style.display = 'block';
    userProfile.innerHTML = `<p>Logged in as ${currentUser}</p>`;
    userProfile.style.display = 'block';
    showStrategies(currentUser);
});

    createStrategyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const strategyName = document.getElementById('strategyName').value;
        const strategyDescription = document.getElementById('strategyDescription').value;
        const targetInvestment = document.getElementById('targetInvestment').value;
        addStrategy(currentUser, { strategyName, strategyDescription, targetInvestment });
    });

function showStrategies(username) {
    strategiesList.innerHTML = '';
    const strategies = userStrategies[username] || userStrategies["demoUser"];
    strategies.forEach(strategy => {
        let strategyDiv = document.createElement('div');
        strategyDiv.classList.add('strategy-item');
        strategyDiv.innerHTML = `
            <p><strong>${strategy.strategyName}</strong> by Dr. R</p>
            <div class="strategy-image" style="display:none;"><img src="${strategy.imageURL}" alt="${strategy.strategyName}" style="max-width:100%; height:auto;"></div>`;
        strategyDiv.addEventListener('click', () => toggleStrategyDetails(strategy.strategyName, 'Dr. R'));
        strategiesList.appendChild(strategyDiv);
    });
}

    // Toggle Strategy Details
    function toggleStrategyDetails(strategyName, username) {
        if (strategyDetails.style.display === 'block' && strategyDetails.getAttribute('data-current-strategy') === strategyName) {
            strategyDetails.style.display = 'none';
            strategyDetails.removeAttribute('data-current-strategy');
        } else {
            showStrategyDetails(strategyName, username);
            strategyDetails.setAttribute('data-current-strategy', strategyName);
        }
    }

    // Show Strategy Details
    window.showStrategyDetails = function(strategyName, username) {
    const strategies = userStrategies[username] || userStrategies["demoUser"];
    const strategy = strategies.find(s => s.strategyName === strategyName);

   if (strategy) {
        let investmentProgress = (strategy.currentInvestment / strategy.targetInvestment) * 100;
        let componentsList = strategy.components.split(',').map(component => `<li>${component.trim()}</li>`).join('');
        strategyDetails.innerHTML = `
            <h3>${strategy.strategyName}</h3>
            <p><strong style="font-weight: bold; text-decoration: underline;">Description:</strong></p>
            <p>${strategy.strategyDescription}</p>
            <p><strong style="font-weight: bold; text-decoration: underline;">Components:</strong></p>
            <ul>${componentsList}</ul>
            <p>Target Investment: \$${strategy.targetInvestment.toLocaleString()}</p>
            <p>Current Investment: \$${strategy.currentInvestment.toLocaleString()}</p>
            <button onclick="contributeToStrategy('${strategy.strategyName}')">Contribute</button>
            <img src="${strategy.imageURL}" alt="Strategy Chart" class="strategy-chart">
        `;
        strategyDetails.style.display = 'block';
    } else {
        console.error("Strategy not found:", strategyName);
    }
    userProfile.style.display = 'none';
};


    function addStrategy(username, strategy) {
        userStrategies[username] = userStrategies[username] || [];
        userStrategies[username].push(strategy);
        showStrategies(username);
    }

    window.showUserProfile = function(username) {
        const strategies = userStrategies[username].map(s => `<li>${s.strategyName} - Return: TBD</li>`).join('');
        userProfile.innerHTML = `<h3>${username}'s Strategies</h3><ul>${strategies}</ul>`;
        userProfile.style.display = 'block';
        strategyDetails.style.display = 'none';
    };

    // Function to handle contribution
    window.contributeToStrategy = async function(strategyName) {
        console.log("Contribute to Strategy called for", strategyName);

        // Accessing strategies of 'demoUser'
        const strategies = userStrategies["demoUser"];

        // Find the strategy by name
        const strategy = strategies.find(s => s.strategyName === strategyName);
        if (!strategy) {
            console.error("Strategy not found:", strategyName);
            return;
        }

        // Prompt user for contribution amount
        const amount = prompt('Enter the amount to contribute in ETH:', '0.01');
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            alert('Invalid contribution amount');
            return;
        }

        // Proceed with contribution using web3 and MetaMask
        if (web3 && contract) {
            try {
                const accounts = await web3.eth.getAccounts();
                await contract.methods.contribute().send({
                    from: accounts[0],
                    value: web3.utils.toWei(amount, 'ether')
                });

                alert("Contribution successful!");
                // Optionally, update the UI to reflect the new contribution
            } catch (error) {
                console.error("Error during contribution:", error);
                alert("Contribution failed.");
            }
        } else {
            console.log('Web3 is not initialized. MetaMask is not installed or user is not logged in.');
        }
    };

}); // This closing brace and parenthesis pair closes the 'DOMContentLoaded' event listener