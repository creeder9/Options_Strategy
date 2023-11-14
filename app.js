document.addEventListener('DOMContentLoaded', () => {
    let currentUser = null;
    const userStrategies = {
        "demoUser": [{
            strategyName: "Sample Strategy",
            strategyDescription: "This is a sample strategy for demonstration purposes.",
            targetInvestment: 10000,
            currentInvestment: 5000 // This is a demo value for the current funding status
        }]
    };

    const loginForm = document.getElementById('loginForm');
    const createStrategyForm = document.getElementById('createStrategyForm');
    const strategiesList = document.getElementById('strategiesList');
    const userProfile = document.getElementById('userProfile');
    const strategyDetails = document.getElementById('strategyDetails');

    // Handle login
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        currentUser = document.getElementById('username').value;
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('strategySection').style.display = 'block';
        userProfile.innerHTML = `<p>Logged in as ${currentUser}</p>`;
        userProfile.style.display = 'block';

        if (!userStrategies[currentUser]) {
            userStrategies[currentUser] = [];
        }

        // Show the static strategy for demo
        showStaticStrategy();
    });

    // Handle strategy creation
    createStrategyForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const strategyName = document.getElementById('strategyName').value;
        const strategyDescription = document.getElementById('strategyDescription').value;
        const targetInvestment = document.getElementById('targetInvestment').value;

        userStrategies[currentUser].push({ strategyName, strategyDescription, targetInvestment });
        strategiesList.innerHTML += `<p onclick="showStrategyDetails('${strategyName}', '${currentUser}')"><strong>${strategyName}</strong> by ${currentUser} - Target Investment: ${targetInvestment}</p>`;

        createStrategyForm.reset();
    });

    // Function to show user profile
    window.showUserProfile = function(username) {
        const strategies = userStrategies[username].map(s => `<li>${s.strategyName} - Return: TBD</li>`).join('');
        userProfile.innerHTML = `<h3>${username}'s Strategies</h3><ul>${strategies}</ul>`;
        userProfile.style.display = 'block';
        strategyDetails.style.display = 'none';
    };

    // Function to show strategy details
    window.showStrategyDetails = function(strategyName, username) {
        const strategy = userStrategies[username].find(s => s.strategyName === strategyName);
        strategyDetails.innerHTML = `
            <p><strong>${strategy.strategyName}</strong> by <span onclick="showUserProfile('${username}')">${username}</span> - ${strategy.strategyDescription} - Target Investment: ${strategy.targetInvestment}</p>
            <img src="chart.png" alt="Strategy Chart"> <!-- Add your chart image here -->
        `;
        strategyDetails.style.display = 'block';
        userProfile.style.display = 'none';
    };

    // Function to show the static strategy on login
    function showStaticStrategy() {
        const demoStrategy = userStrategies["demoUser"][0];
        strategiesList.innerHTML = `<p onclick="showStrategyDetails('${demoStrategy.strategyName}', 'demoUser')"><strong>${demoStrategy.strategyName}</strong> by demoUser - Target Investment: ${demoStrategy.targetInvestment} - Current Investment: ${demoStrategy.currentInvestment}</p>`;
    }
});
