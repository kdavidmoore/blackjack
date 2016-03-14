var theDeck = [];
var playerHand = [];
var dealerHand = [];
var placeInDeck = 0;

$(document).ready(function() {
	// set up a click listener on all buttons
	$('button').click(function() {
		var clickedButton = $(this).attr('id');
		if (clickedButton == 'deal-button') {
			deal();
		} else if (clickedButton == 'hit-button') {
			hit();
		} else if (clickedButton == 'stand-button') {
			stand();
		}
	});
});

function deal() {
	shuffleDeck();
	playerHand = [ theDeck[0], theDeck[2] ];
	dealerHand = [ theDeck[1], theDeck[3] ];
	placeInDeck = 4; 
	placeCard(playerHand[0], 'player', 'one');
	placeCard(dealerHand[0], 'dealer', 'one');
	placeCard(playerHand[1], 'player', 'two');
	placeCard(dealerHand[1], 'dealer', 'two');
	calculateTotal(playerHand, 'player');
	calculateTotal(dealerHand, 'dealer');
	// can check for bust here
}

function placeCard(card, who, slot) {
	var currID = '#' + who + '-card-' + slot;
	$(currID).removeClass('empty');
	$(currID).html(card);
	if (card.slice(0,2) == '1s' || card.slice(0,2) == '1h' || card.slice(0,2) == '1d' || card.slice(0,2) == '1c') {
		$(currID).html('A' + card.slice(1,2));
	}
	else if (card.slice(0,2) == '13') {
		$(currID).html('K' + card.slice(2,3));
	}
	else if (card.slice(0,2) == '12') {
		$(currID).html('Q' + card.slice(2,3));
	}
	else if (card.slice(0,2) == '11') {
		$(currID).html('J' + card.slice(2,3));
	}
}

function calculateTotal(hand, who) {
	var total = 0;
	var cardValue = 0;
	for (i = 0; i < hand.length; i++) {
		cardValue = Number(hand[i].slice(0, -1)); // does not include the suit
		total += cardValue;
	}
	// update the HTML
	var idToGet = '.' + who + '-total';
	$(idToGet).html(total);

	// if total > 21, check for 'bust'
	if (total > 21) {
		bust(whosTurn);
	}
}

function shuffleDeck() {
	// deck is made of 52 cards and 4 suits (h, s, d, c)
	// s = 1 is hearts, s = 2 is spades, s = 3 is diamonds, s = 4 is clubs
	// outer loop creates 4 suits
	for (s = 1; s <= 4; s++) {
		var suit = "";
		if (s === 1){
			suit = 'h';
		} else if (s === 2) {
			suit = 's';
		} else if (s === 3) {
			suit = 'd';
		} else if (s === 4) {
			suit = 'c';
		}
		// inner loop creates 13 cards for each suit
		for (i = 1; i <= 13; i++) {
			theDeck.push(i + suit);
		}
	}
	// shuffling the deck
	var numberOfTimesToShuffle = 500;
	for (i = 1; i < numberOfTimesToShuffle; i++) {
		card1 = Math.floor(Math.random() * theDeck.length);
		card2 = Math.floor(Math.random() * theDeck.length);
		if (card1 != card2) {
			temp = theDeck[card1];
			theDeck[card1] = theDeck[card2];
			theDeck[card2] = temp;
		}
	}
	console.log(theDeck);
}

function hit() {
	var slot = '';
	if (playerHand.length == 2) {
		slot = "three";
	} else if (playerHand.length == 3) {
		slot = "four";
	} else if (playerHand.length == 4) {
		slot = "five";
	} else if (playerHand.length == 5) {
		slot = "six";
	}
	placeCard(theDeck[placeInDeck], 'player', slot);
	playerHand.push(theDeck[placeInDeck]);
	placeInDeck++;
	calculateTotal(playerHand, 'player');
}

function stand(){
	var dealerTotal = $('.dealer-total').html();
	while(dealerTotal < 17) {
		if (dealerHand.length == 2) {
			slot = "three";
		} else if (dealerHand.length == 3) {
			slot = "four";
		} else if (dealerHand.length == 4) {
			slot = "five";
		} else if (dealerHand.length == 5) {
			slot = "six";
		}
		placeCard(theDeck[placeInDeck], 'dealer', slot);
		dealerHand.push(theDeck[placeInDeck]);
		placeInDeck++;
		calculateTotal(dealerHand, 'dealer');
		dealerTotal = $('.dealer-total').html();
	}
	checkWin();
}

function checkWin() {
	var playerHas = Number($('.player-total').html());
	var dealerHas = Number($('.dealer-total').html());
	if (dealerHas > 21) {
		// the dealer has busted
		bust('dealer');
	} else {
		// neither player has busted and the dealer has at least 17
		if (playerHas > dealerHas) {
			// player won
			$('#message').html('You beat the dealer!');
		} else if (playerHas < dealerHas) {
			// dealer won
			$('#message').html('Alas, you lost to the dealer.');
		} else {
			// it's a tie
			$('#message').html('It\'s a push!');
		}
	}
}

function bust(who) {
	if (who === 'player') {
		$('#message').html('You have busted!');
	} else {
		$('#message').html('The dealer has busted!');
	}
}
