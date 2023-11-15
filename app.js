document.addEventListener('DOMContentLoaded', () => {
    let currentUser = null;
    const userStrategies = {
        "demoUser": [
            // Pre-defined strategies
            { strategyName: "Sample Strategy", strategyDescription: "This is a sample strategy for demonstration purposes.", targetInvestment: 10000, currentInvestment: 5000 },
            { strategyName: "Conservative Strategy", strategyDescription: "A low-risk, long-term growth strategy focused on stability.", targetInvestment: 15000, currentInvestment: 7500 },
            { strategyName: "Aggressive Growth Strategy", strategyDescription: "High-risk, high-reward strategy aiming for rapid growth.", targetInvestment: 20000, currentInvestment: 10000 }
        ]
    };

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
        e.preventDefault();
        currentUser = document.getElementById('username').value;
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

    // Helper Functions
    function showStrategies(username) {
        strategiesList.innerHTML = '';
        const strategies = userStrategies[username] || userStrategies["demoUser"];
        strategies.forEach(strategy => {
            // Each strategy now has an onclick event to show its details
            strategiesList.innerHTML += `<p onclick="showStrategyDetails('${strategy.strategyName}', '${username}')"><strong>${strategy.strategyName}</strong> by ${username} - Target Investment: ${strategy.targetInvestment}</p>`;
        });
    }

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

    window.showStrategyDetails = function(strategyName, demoUser) {
        console.log("showStrategyDetails called for", strategyName, "by", username);
        const allStrategies = Object.values(userStrategies).flat(); // Flatten all strategies
        const strategy = allStrategies.find(s => s.strategyName === strategyName);

        if (strategy) {
            strategyDetails.innerHTML = `
                <h3>${strategy.strategyName}</h3>
                <p>Description: ${strategy.strategyDescription}</p>
                <p>Target Investment: ${strategy.targetInvestment}</p>
                <p>Current Investment: ${strategy.currentInvestment}</p>
                <img src="chart.png" alt="Strategy Chart" class="strategy-chart"> <"C:/Users/carso/Fall23/Capstone/Project/chart.png">
            `;
            strategyDetails.style.display = 'block';
        } else {
            console.error("Strategy not found:", strategyName);
        }
        userProfile.style.display = 'none';
    };
});
