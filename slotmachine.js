class SlotMachine {
    constructor() {
        this.symbols = ['🍒', '🍋', '🍇', '🍊', '7️⃣'];
        this.credits = 100;
        this.slots = Array.from({length: 9}, (_, i) => 
            document.getElementById(`slot${i + 1}`)
        );
        this.spinBtn = document.getElementById('spinBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.resultDisplay = document.getElementById('result');
        this.creditsDisplay = document.getElementById('credits');

        this.spinBtn.addEventListener('click', () => this.spin());
        this.resetBtn.addEventListener('click', () => this.reset());
    }

    spin() {
        // Check if can spin
        if (this.credits < 20) {
            this.resultDisplay.textContent = 'Not enough credits!';
            return;
        }

        // Deduct credits
        this.credits -= 20;
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

        // Check for full rows and diagonals
        const winPatterns = [
            // Horizontal rows
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            // Vertical columns
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            // Diagonals
            [0, 4, 8], [2, 4, 6]
        ];

        const winningRow = winPatterns.find(pattern => 
            pattern.every(index => slotValues[index] === slotValues[pattern[0]]) &&
            slotValues[pattern[0]] !== '?'
        );

        if (winningRow) {
            const winnings = winningRow.some(index => slotValues[index] === '7️⃣') ? 100 : 50;
            this.credits += winnings;
            this.resultDisplay.textContent = `Winning line! You won ${winnings} credits!`;
        } else {
            this.resultDisplay.textContent = 'No win this time. Try again!'; 
        }

        // Update credits display
        this.creditsDisplay.textContent = `Credits: ${this.credits}`;

        // Disable spin if out of credits
        this.spinBtn.disabled = this.credits < 20;
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