import type { Card } from './card';

export function getHandName(hand: Hand) {
	switch (hand) {
		case Hand.RoyalFlush:
			return 'Royal Flush';
		case Hand.StraightFlush:
			return 'Straight Flush';
		case Hand.FourOfAKind:
			return 'Four of a Kind';
		case Hand.FullHouse:
			return 'Full House';
		case Hand.Flush:
			return 'Flush';
		case Hand.Straight:
			return 'Straight';
		case Hand.ThreeOfAKind:
			return 'Three of a Kind';
		case Hand.TwoPair:
			return 'Two Pair';
		case Hand.Pair:
			return 'Pair';
		case Hand.HighCard:
			return 'High Card';
		case Hand.Empty:
			return '';
	}
}

export enum Hand {
	RoyalFlush = 9,
	StraightFlush = 8,
	FourOfAKind = 7,
	FullHouse = 6,
	Flush = 5,
	Straight = 4,
	ThreeOfAKind = 3,
	TwoPair = 2,
	Pair = 1,
	HighCard = 0,
	Empty = -1
}

export function calculateHand(
	communityCards: Array<Card>,
	holeCards: Array<Card>
): [Array<number>, Hand] {
	const valueArray = new Array<number>(13).fill(0);
	const suitArray = new Array<number>(4).fill(0);

	const combinedCards = Array.prototype.concat(holeCards, communityCards);

	combinedCards.forEach((card) => {
		valueArray[card.value - 2]++;
		suitArray[card.suit]++;
	});

	const [mostCommonSuit, suitOccurrences] = findMostCommon(suitArray);
	const [mostCommonValue, valueOccurrences] = findMostCommon(valueArray);

	const optimalHand: Array<number> = [];

	const straightIdx = findStraights(valueArray);
	if (straightIdx != -1) {
		if (suitOccurrences >= 5) {
			let straightFlush = true;
			for (let i = straightIdx + 2; i > straightIdx - 3; i--) {
				if (!containsCard(combinedCards, mostCommonSuit, i)) {
					straightFlush = false;
					break;
				}
			}
			if (straightFlush) {
				if (straightIdx == 12) {
					for (let i = straightIdx + 2; i > straightIdx - 3; i--) {
						optimalHand.push(getCardIndex(combinedCards, mostCommonSuit, i));
					}
					return [optimalHand, Hand.RoyalFlush];
				} else {
					for (let i = straightIdx + 2; i > straightIdx - 3; i--) {
						optimalHand.push(getCardIndex(combinedCards, mostCommonSuit, i));
					}
					return [optimalHand, Hand.StraightFlush];
				}
			}
		}
	}

	if (valueOccurrences == 4) {
		addMultipleCards(optimalHand, combinedCards, valueArray, mostCommonValue, 4);
		return [optimalHand, Hand.FourOfAKind];
	}

	valueArray[mostCommonValue] = 0;
	const [secondMostCommonValue, secondValueOccurrences] = findMostCommon(valueArray);
	valueArray[mostCommonValue] = valueOccurrences;

	if (valueOccurrences == 3 && secondValueOccurrences >= 2) {
		addMultipleCards(optimalHand, combinedCards, valueArray, mostCommonValue, 3);
		addMultipleCards(optimalHand, combinedCards, valueArray, secondMostCommonValue, 2);
		return [optimalHand, Hand.FullHouse];
	} else if (suitOccurrences >= 5) {
		let startIdx = 0;
		for (let i = 0; i < 5; i++) {
			const idx = getSuitIndex(combinedCards, mostCommonSuit, startIdx);
			optimalHand.push(idx);
			startIdx = idx + 1;
		}
	} else if (straightIdx != -1) {
		for (let i = straightIdx + 2; i > straightIdx - 3; i--) {
			optimalHand.push(getValueIndex(combinedCards, i));
		}
		return [optimalHand, Hand.Straight];
	} else if (valueOccurrences == 3) {
		addMultipleCards(optimalHand, combinedCards, valueArray, mostCommonValue, 3);
		return [optimalHand, Hand.ThreeOfAKind];
	} else if (valueOccurrences == 2 && secondValueOccurrences == 2) {
		addMultipleCards(optimalHand, combinedCards, valueArray, mostCommonValue, 2);
		addMultipleCards(optimalHand, combinedCards, valueArray, secondMostCommonValue, 2);
		return [optimalHand, Hand.TwoPair];
	} else if (valueOccurrences == 2) {
		addMultipleCards(optimalHand, combinedCards, valueArray, mostCommonValue, 2);
		return [optimalHand, Hand.Pair];
	} else if (combinedCards.length > 0) {
		addHighestCard(optimalHand, combinedCards, valueArray);
		return [optimalHand, Hand.HighCard];
	}
	return [[], Hand.Empty];
}

function addMultipleCards(
	hand: Array<number>,
	cards: Array<Card>,
	valueArray: Array<number>,
	value: number,
	count: number
) {
	let startIdx = 0;
	for (let i = 0; i < count; i++) {
		const idx = getValueIndex(cards, value + 2, startIdx);
		hand.push(idx);
		valueArray[value]--;
		startIdx = idx + 1;
	}
}

function addHighestCards(hand: Array<number>, cards: Array<Card>, valueArray: Array<number>) {
	let count = 0;
	const cardsToAdd = 5 - hand.length;

	for (let j = valueArray.length - 1; j > -1; j--) {
		if (count >= cardsToAdd) {
			break;
		}
		if (valueArray[j] != 0) {
			hand.push(getValueIndex(cards, j + 2));
			valueArray[j]--;
			count++;
		}
	}
}

function addHighestCard(hand: Array<number>, cards: Array<Card>, valueArray: Array<number>) {
	for (let j = valueArray.length - 1; j > -1; j--) {
		if (valueArray[j] != 0) {
			hand.push(getValueIndex(cards, j + 2));
			valueArray[j]--;
			break;
		}
	}
}

function getCardIndex(array: Array<Card>, suit: number, value: number): number {
	for (let i = 0; i < array.length; i++) {
		if (array[i].value == value && array[i].suit == suit) {
			return i;
		}
	}
	return -1;
}

function getValueIndex(array: Array<Card>, value: number, startIdx = 0): number {
	for (let i = startIdx; i < array.length; i++) {
		if (array[i].value == value) {
			return i;
		}
	}
	return -1;
}

function getSuitIndex(array: Array<Card>, suit: number, startIdx = 0): number {
	for (let i = startIdx; i < array.length; i++) {
		if (array[i].suit == suit) {
			return i;
		}
	}
	return -1;
}

function containsCard(array: Array<Card>, suit: number, value: number): boolean {
	for (let i = 0; i < array.length; i++) {
		if (array[i].value == value && array[i].suit == suit) {
			return true;
		}
	}
	return false;
}

function findStraights(valueArray: Array<number>): number {
	for (let i = valueArray.length - 1; i > 3; i--) {
		let found = true;
		for (let j = i; j > i - 5; j--) {
			if (valueArray[j] == 0) {
				found = false;
				break;
			}
		}
		if (found) {
			return i;
		}
	}
	return -1;
}

function findMostCommon(array: Array<number>): [number, number] {
	let max = 0,
		idx = 0;
	for (let i = 0; i < array.length; i++) {
		if (array[i] >= max) {
			max = array[i];
			idx = i;
		}
	}

	return [idx, max];
}
