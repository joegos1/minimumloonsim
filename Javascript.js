class ClickerGame {
            constructor() {
                this.points = 0;
                this.pointsPerClick = 1;
                this.pointsPerSecond = 0;
                this.clickUpgradeCost = 10;
                this.autoClickerCost = 50;
                
                this.initializeElements();
                this.setupEventListeners();
                this.startAutoClicker();
            }

            initializeElements() {
                this.pointsDisplay = document.getElementById('points');
                this.pointsPerClickDisplay = document.getElementById('pointsPerClick');
                this.pointsPerSecondDisplay = document.getElementById('pointsPerSecond');
                this.clickUpgradeBtn = document.getElementById('clickUpgrade');
                this.autoClickerUpgradeBtn = document.getElementById('autoClickerUpgrade');
                this.clickUpgradeCostDisplay = document.getElementById('clickUpgradeCost');
                this.autoClickerCostDisplay = document.getElementById('autoClickerCost');
            }

            setupEventListeners() {
                document.getElementById('clickButton').addEventListener('click', () => this.click());
                this.clickUpgradeBtn.addEventListener('click', () => this.purchaseClickUpgrade());
                this.autoClickerUpgradeBtn.addEventListener('click', () => this.purchaseAutoClicker());
            }

            click() {
                this.points += this.pointsPerClick;
                this.updateDisplay();
            }

            purchaseClickUpgrade() {
                if (this.points >= this.clickUpgradeCost) {
                    this.points -= this.clickUpgradeCost;
                    this.pointsPerClick++;
                    this.clickUpgradeCost = Math.floor(this.clickUpgradeCost * 1.5);
                    this.updateDisplay();
                }
            }

            purchaseAutoClicker() {
                if (this.points >= this.autoClickerCost) {
                    this.points -= this.autoClickerCost;
                    this.pointsPerSecond++;
                    this.autoClickerCost = Math.floor(this.autoClickerCost * 1.5);
                    this.updateDisplay();
                }
            }

            startAutoClicker() {
                setInterval(() => {
                    this.points += this.pointsPerSecond;
                    this.updateDisplay();
                }, 1000);
            }

            updateDisplay() {
                this.pointsDisplay.textContent = Math.floor(this.points);
                this.pointsPerClickDisplay.textContent = this.pointsPerClick;
                this.pointsPerSecondDisplay.textContent = this.pointsPerSecond;
                this.clickUpgradeCostDisplay.textContent = this.clickUpgradeCost;
                this.autoClickerCostDisplay.textContent = this.autoClickerCost;
                
                // Update button states
                this.clickUpgradeBtn.disabled = this.points < this.clickUpgradeCost;
                this.autoClickerUpgradeBtn.disabled = this.points < this.autoClickerCost;
            }
        }

        // Initialize the game
        const game = new ClickerGame();