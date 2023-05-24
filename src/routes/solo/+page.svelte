<script lang="ts">
    import CardComponent from "../../components/CardComponent.svelte";
    import { Card } from "../../ts/card";
    import { calculateHand, getHandName, Hand } from "../../ts/hand";

    const NUM_OF_DECKS = 1;

    class CardTracker {
        suit: number;
        value: number;
        count: number;

        constructor(suit: number, value: number, count: number) {
            this.suit = suit;
            this.value = value;
            this.count = count;
        }
    }

    function shuffleDeck(
        deck: CardTracker[],
        communityCards: Card[],
        holeCards: Card[]
    ) {
        for (let i = 2; i < 15; i++) {
            for (let j = 0; j < 4; j++) {
                deck.push(new CardTracker(j, i, NUM_OF_DECKS));
            }
        }

        communityCards.forEach((card) => {
            removeCard(deck, findCardInDeck(deck, card));
        });

        holeCards.forEach((card) => {
            removeCard(deck, findCardInDeck(deck, card));
        });
    }

    function findCardInDeck(deck: CardTracker[], card: Card): number {
        return deck.findIndex(
            (tracker: CardTracker) =>
                tracker.value == card.value && tracker.suit == card.suit
        );
    }

    function drawCard(deck: Array<CardTracker>): Card {
        let idx = Math.floor(Math.random() * deck.length);
        if (deck.length == 0) {
            console.log("Shuffling...");
            shuffleDeck(deck, communityCards, holeCards);
        }
        return removeCard(deck, idx);
    }

    function removeCard(deck: Array<CardTracker>, idx: number): Card {
        if (deck[idx].count == 1) {
            let result = deck.splice(idx, 1)[0];
            return new Card(result.suit, result.value);
        } else {
            deck[idx].count--;
            return new Card(deck[idx].suit, deck[idx].value);
        }
    }

    let deck: Array<CardTracker> = [];
    let holeCards: Array<Card> = [];
    let communityCards: Array<Card> = [];

    function dealHole() {
        holeCards.push(drawCard(deck));
        holeCards.push(drawCard(deck));
        holeCards = holeCards;
    }

    function dealCommunity(count: number) {
        for (let i = 0; i < count; i++) {
            communityCards.push(drawCard(deck));
        }
        communityCards = communityCards;
    }

    function resetHand() {
        holeCards = [];
        communityCards = [];
    }

    let continueText = "Draw";
    let handCards: Array<number> = [],
        hand = Hand.Empty;
    let gameState = 0;
    function updateGameState() {
        switch (gameState) {
            case 0:
                dealHole();
                continueText = "The Flop";
                break;
            case 1:
                dealCommunity(3);
                continueText = "The Turn";
                break;
            case 2:
                dealCommunity(1);
                continueText = "The River";
                break;
            case 3:
                dealCommunity(1);
                continueText = "Reset";
                break;
            case 4:
                resetHand();
                gameState = -1;
                continueText = "Draw";
                break;
        }
        [handCards, hand] = calculateHand(communityCards, holeCards);
        console.log(getHandName(hand), handCards);
        gameState++;
    }
</script>

<nav>
    <a href="/">home</a>
</nav>
<div class="container">
    <b>{getHandName(hand)}</b>
    <div class="cards">
        {#each communityCards as communityCard, index}
            <CardComponent
                name={communityCard.name}
                suit={communityCard.suit}
                index={index + 2}
                {handCards}
            />
        {/each}
    </div>
    <div class="cards">
        {#each holeCards as holeCard, index}
            <CardComponent
                name={holeCard.name}
                suit={holeCard.suit}
                {index}
                {handCards}
            />
        {/each}
    </div>
    <button on:click={updateGameState}>{continueText}</button>
</div>


<style>
    nav {
        position: absolute;
    }
    
    .cards {
        display: flex;
        justify-content: center;
        width: 100%;
    }

    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }
</style>
