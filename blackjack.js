class Card {
    constructor(suit, value) {
        this.suit = suit;
        this.value = value;
    }

    toString() {
        const values = {
            1: 'A', 11: 'J', 12: 'Q', 13: 'K'
        };
        const suits = {
            'hearts': '♥',
            'diamonds': '♦',
            'clubs': '♣',
            'spades': '♠'
        };
        return `${values[this.value] || this.value}${suits[this.suit]}`;
    }

    get score() {
        if (this.value === 1) return 11;
        return this.value > 10 ? 10 : this.value;
    }
}

class Deck {
    constructor() {
        this.reset();
    }

    reset() {
        this.cards = [];
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        for (let suit of suits) {
            for (let value = 1; value <= 13; value++) {
                this.cards.push(new Card(suit, value));
            }
        }
        this.shuffle();
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    deal() {
        return this.cards.pop();
    }
}

class Game {
    constructor() {
        this.deck = new Deck();
        this.playerHand = [];
        this.dealerHand = [];
        this.gameOver = true;

        // DOM elements
        this.dealBtn = document.getElementById('deal');
        this.hitBtn = document.getElementById('hit');
        this.standBtn = document.getElementById('stand');
        this.messageEl = document.getElementById('message');
        this.playerHandEl = document.getElementById('player-hand');
        this.dealerHandEl = document.getElementById('dealer-hand');
        this.playerScoreEl = document.getElementById('player-score');
        this.dealerScoreEl = document.getElementById('dealer-score');

        // Event listeners
        this.dealBtn.addEventListener('click', () => this.deal());
        this.hitBtn.addEventListener('click', () => this.hit());
        this.standBtn.addEventListener('click', () => this.stand());
    }

    async deal() {
        this.messageEl.classList.remove('show');
        await new Promise(resolve => setTimeout(resolve, 300));
        
        this.deck.reset();
        this.playerHand = [];
        this.dealerHand = [];
        this.gameOver = false;

        // Clear previous cards
        this.playerHandEl.innerHTML = '<h2>Your Hand: <span id="player-score" class="score">0</span></h2>';
        this.dealerHandEl.innerHTML = '<h2>Dealer\'s Hand: <span id="dealer-score" class="score">0</span></h2>';

        // Deal initial cards with animation
        await this.animateCard(this.deck.deal(), true, 0);
        await this.animateCard(this.deck.deal(), false, 0);
        await this.animateCard(this.deck.deal(), true, 1, true);
        await this.animateCard(this.deck.deal(), false, 1);

        this.updateControls();
        this.updateDisplay();

        if (this.getScore(this.playerHand) === 21) {
            this.endGame('Blackjack! You win!');
        }
    }

    async animateCard(card, isDealer, position, hidden = false) {
        const hand = isDealer ? this.dealerHand : this.playerHand;
        hand.push(card);

        const cardEl = document.createElement('div');
        cardEl.className = `card ${card.suit === 'hearts' || card.suit === 'diamonds' ? 'red' : ''} ${hidden ? 'hidden' : ''}`;
        cardEl.textContent = card.toString();
        cardEl.style.setProperty('--dealt-position', `${position * 110}px`);
        
        const container = isDealer ? this.dealerHandEl : this.playerHandEl;
        container.appendChild(cardEl);

        await new Promise(resolve => setTimeout(resolve, 50));
        cardEl.classList.add('dealt');
        
        await new Promise(resolve => setTimeout(resolve, 300));
        this.updateScore(isDealer);
    }

    async hit() {
        const card = this.deck.deal();
        await this.animateCard(card, false, this.playerHand.length);
        
        const score = this.getScore(this.playerHand);
        if (score > 21) {
            this.endGame('Bust! You lose!');
        } else if (score === 21) {
            this.stand();
        }
    }

    async stand() {
        this.updateControls();
        
        // Reveal dealer's hidden card
        const hiddenCard = this.dealerHandEl.querySelector('.card.hidden');
        if (hiddenCard) {
            hiddenCard.classList.remove('hidden');
        }

        // Dealer's turn
        while (this.getScore(this.dealerHand) < 17) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const card = this.deck.deal();
            await this.animateCard(card, true, this.dealerHand.length);
        }

        const playerScore = this.getScore(this.playerHand);
        const dealerScore = this.getScore(this.dealerHand);

        if (dealerScore > 21) {
            this.endGame('Dealer busts! You win!');
        } else if (dealerScore > playerScore) {
            this.endGame('Dealer wins!');
        } else if (dealerScore < playerScore) {
            this.endGame('You win!');
        } else {
            this.endGame('Push! It\'s a tie!');
        }
    }

    getScore(hand) {
        let score = 0;
        let aces = 0;

        for (let card of hand) {
            if (card.value === 1) aces++;
            score += card.score;
        }

        while (score > 21 && aces > 0) {
            score -= 10;
            aces--;
        }

        return score;
    }

    updateScore(isDealer) {
        const scoreEl = document.getElementById(isDealer ? 'dealer-score' : 'player-score');
        const score = this.getScore(isDealer ? this.dealerHand : this.playerHand);
        scoreEl.textContent = score;
        
        scoreEl.classList.add('update');
        setTimeout(() => scoreEl.classList.remove('update'), 300);
    }

    updateControls() {
        this.dealBtn.disabled = !this.gameOver;
        this.hitBtn.disabled = this.gameOver;
        this.standBtn.disabled = this.gameOver;
    }

    endGame(message) {
        this.gameOver = true;
        this.messageEl.textContent = message;
        this.messageEl.classList.add('show');
        
        // Reveal all cards
        const hiddenCards = document.querySelectorAll('.card.hidden');
        hiddenCards.forEach(card => card.classList.remove('hidden'));

        // Add win animation if player wins
        if (message.includes('You win')) {
            this.playerHandEl.querySelectorAll('.card').forEach(card => {
                card.classList.add('win-animation');
            });
        }

        this.updateControls();
    }
}

// Start the game
const game = new Game();