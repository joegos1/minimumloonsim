class SlotMachine {
    constructor() {
        this.symbols = ['🍒', '🍋', '🍇', '🍊', '7️⃣'];
        this.credits = 100;
        this.slots = [
            document.getElementById('slot1'),
            document.getElementById('slot2'),
            document.getElementById('slot3')
        ];
        this.spinBtn = document.getElementById('spinBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.resultDisplay = document.getElementById('result');
        this.creditsDisplay = document.getElementById('credits');

        this.spinBtn.addEventListener('click', () => this.spin());
        this.resetBtn.addEventListener('click', () => this.reset());
    }

    spin() {
        // Check if can spin
        if (this.credits < 10) {
            this.resultDisplay.textContent = 'Not enough credits!';
            return;
        }

        // Deduct credits
        this.credits -= 10;
        this.creditsDisplay.textContent = `Credits: ${this.credits}`;

        // Add spinning class
        this.slots.forEach(slot => {
            slot.classList.add('spinning');
        });

        // Stop spinning and reveal results after delay
        setTimeout(() => {
            // Remove spinning class and get new symbols
            this.slots.forEach(slot => {
                slot.classList.remove('spinning');
                slot.textContent = this.symbols[
                    Math.floor(Math.random() * this.symbols.length)
                ];
            });

            // Check win conditions
            this.checkWin();
        }, 1000);
    }

    checkWin() {
        const slotValues = this.slots.map(slot => slot.textContent);

        if (slotValues[0] === slotValues[1] && slotValues[1] === slotValues[2]) {
            // Jackpot
            const winnings = 50;
            this.credits += winnings;
            this.resultDisplay.textContent = `Jackpot! You won ${winnings} credits!`;
        } else if (slotValues[0] === slotValues[1] || slotValues[1] === slotValues[2]) {
            // Small win
            const winnings = 20;
            this.credits += winnings;
            this.resultDisplay.textContent = `Small win! You won ${winnings} credits!`;
        } else {
            this.resultDisplay.textContent = 'No win this time. Try again!';
        }

        // Update credits display
        this.creditsDisplay.textContent = `Credits: ${this.credits}`;

        // Disable spin if out of credits
        this.spinBtn.disabled = this.credits < 10;
    }

    reset() {
        this.credits = 100;
        this.creditsDisplay.textContent = `Credits: ${this.credits}`;
        this.slots.forEach(slot => {
            slot.textContent = '?';
        });
        this.resultDisplay.textContent = '';
        this.spinBtn.disabled = false;
    }
}

// Initialize the game
new SlotMachine();