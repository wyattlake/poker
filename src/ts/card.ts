export class Card {
	suit: number;
	value: number;
	name: string;

	constructor(suit: number, value: number) {
		this.suit = suit;
		this.value = value;
		this.name = displayValue(value) + ' of ' + displaySuit(suit);
	}
}

function displaySuit(suit: number): string {
	switch (suit) {
		case 0:
			return 'Spades';
		case 1:
			return 'Hearts';
		case 2:
			return 'Diamonds';
		case 3:
			return 'Clubs';
		default:
			return '';
	}
}

function displayValue(value: number): string {
	switch (value) {
		case 14:
			return 'Ace';
		case 13:
			return 'King';
		case 12:
			return 'Queen';
		case 11:
			return 'Jack';
		default:
			return value.toString();
	}
}
