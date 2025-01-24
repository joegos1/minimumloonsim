class ClickerGame {
    constructor() {
        this.score = 0;
        this.perClick = 1;
        this.autoClicks = 0;
        this.multiplier = 1;
        this.clickUpgradeCost = 10;
        this.autoClickerCost = 50;
        this.multiplierCost = 100;

        this.initializeElements();
        this.setupEventListeners();
        this.startAutoClicker();
    }
    

    initializeElements() {
        this.scoreDisplay = document.getElementById('score');
        this.perClickDisplay = document.getElementById('perClick');
        this.autoClicksDisplay = document.getElementById('autoClicks');
        this.multiplierDisplay = document.getElementById('multiplier');
        this.mainButton = document.getElementById('mainButton');
        this.clickUpgradeButton = document.getElementById('clickUpgrade');
        this.autoClickUpgradeButton = document.getElementById('autoClickUpgrade');
        this.multiplierUpgradeButton = document.getElementById('multiplierUpgrade');
    }

    setupEventListeners() {
        this.mainButton.addEventListener('click', (e) => this.handleClick(e));
        this.clickUpgradeButton.addEventListener('click', () => this.buyClickUpgrade());
        this.autoClickUpgradeButton.addEventListener('click', () => this.buyAutoClicker());
        this.multiplierUpgradeButton.addEventListener('click', () => this.buyMultiplier());
    }

    createFloatingNumber(x, y, amount) {
        const floatingNum = document.createElement('div');
        floatingNum.className = 'floating-number';
        floatingNum.textContent = `+${amount}`;
        floatingNum.style.left = `${x}px`;
        floatingNum.style.top = `${y}px`;
        
        this.mainButton.appendChild(floatingNum);
        
        setTimeout(() => floatingNum.remove(), 1000);
    }

    handleClick(event) {
        const rect = this.mainButton.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const amount = this.perClick * this.multiplier;
        this.score += amount;
        
        this.createFloatingNumber(x, y, amount);
        this.scoreDisplay.classList.remove('score-bump');
        void this.scoreDisplay.offsetWidth;
        this.scoreDisplay.classList.add('score-bump');
        
        this.updateDisplay();
    }

    buyClickUpgrade() {
        if (this.score >= this.clickUpgradeCost) {
            this.score -= this.clickUpgradeCost;
            this.perClick++;
            this.clickUpgradeCost = Math.floor(this.clickUpgradeCost * 1.5);
            this.clickUpgradeButton.classList.add('purchase-flash');
            setTimeout(() => this.clickUpgradeButton.classList.remove('purchase-flash'), 500);
            this.updateDisplay();
        }
    }

    buyAutoClicker() {
        if (this.score >= this.autoClickerCost) {
            this.score -= this.autoClickerCost;
            this.autoClicks++;
            this.autoClickerCost = Math.floor(this.autoClickerCost * 1.5);
            this.autoClickUpgradeButton.classList.add('purchase-flash');
            setTimeout(() => this.autoClickUpgradeButton.classList.remove('purchase-flash'), 500);
            this.updateDisplay();
        }
    }

    buyMultiplier() {
        if (this.score >= this.multiplierCost) {
            this.score -= this.multiplierCost;
            this.multiplier += 0.5;
            this.multiplierCost = Math.floor(this.multiplierCost * 2);
            this.multiplierUpgradeButton.classList.add('purchase-flash');
            setTimeout(() => this.multiplierUpgradeButton.classList.remove('purchase-flash'), 500);
            this.updateDisplay();
        }
    }

    startAutoClicker() {
        setInterval(() => {
            if (this.autoClicks > 0) {
                this.score += this.autoClicks * this.multiplier;
                this.updateDisplay();
            }
        }, 1000);
    }

    updateDisplay() {
        this.scoreDisplay.textContent = Math.floor(this.score);
        this.perClickDisplay.textContent = this.perClick;
        this.autoClicksDisplay.textContent = this.autoClicks;
        this.multiplierDisplay.textContent = this.multiplier.toFixed(1);
        
        document.getElementById('clickCost').textContent = this.clickUpgradeCost;
        document.getElementById('autoCost').textContent = this.autoClickerCost;
        document.getElementById('multiplierCost').textContent = this.multiplierCost;
        
        this.clickUpgradeButton.disabled = this.score < this.clickUpgradeCost;
        this.autoClickUpgradeButton.disabled = this.score < this.autoClickerCost;
        this.multiplierUpgradeButton.disabled = this.score < this.multiplierCost;
    }
    
}


// Start the game
const game = new ClickerGame();