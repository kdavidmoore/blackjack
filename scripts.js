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
	// clear the table
	theDeck = [];
	playerHand = [];
	dealerHand = [];
	placeInDeck = 0;
	$('#player-total').html('0');
	$('#dealer-total').html('0');
	$('button').prop('disabled', false);
	$('#message').html('');
	$('.card').addClass('empty');
	// shuffle the deck and deal the first two cards
	shuffleDeck();
	playerHand = [ theDeck[0], theDeck[2] ];
	dealerHand = [ theDeck[1], theDeck[3] ];
	placeInDeck = 4; 
	placeCard(playerHand[0], 'player', 'one');
	placeCard(dealerHand[0], 'dealer', 'one');
	setInterval(function(){
		placeCard(playerHand[1], 'player', 'two'); }, 3000);
	setInterval(function(){
		placeCard(dealerHand[1], 'dealer', 'two'); }, 3000);
	setInterval(function(){
		calculateTotal(playerHand, 'player'); }, 3000);
	setInterval(function(){
		calculateTotal(dealerHand, 'dealer'); }, 3000);
	checkWinOnDeal();
}

function placeCard(card, who, slot) {
	var currID = '#' + who + '-card-' + slot;
	$(currID).removeClass('empty');
	$(currID).html('<span class="numberLabel">' + card.slice(0, -2) + '</span>');
	if (card.slice(0,2) === '1s' || card.slice(0,2) === '1h' || card.slice(0,2) === '1d' || card.slice(0,2) === '1c') {
		$(currID).html('<span class="numberLabel">' + 'A' + '</span>');
	}
	else if (card.slice(0,2) === '13') {
		$(currID).html('<span class="numberLabel">' + 'K' + '</span>');
	}
	else if (card.slice(0,2) === '12') {
		$(currID).html('<span class="numberLabel">' + 'Q' + '</span>');
	}
	else if (card.slice(0,2) === '11') {
		$(currID).html('<span class="numberLabel">' + 'J' + '</span>');
	}
	if (card.slice(-1) === 'r') {
		// make color red
		$(currID).addClass('seeingRed');
	} else if (card.slice(-1) === 'b') {
		// make color black
		$(currID).addClass('fadeToBlack');
	}
	if (card.slice(-2,-1) === 's') {
		$(currID).prepend('<img class="suitImg" src="img/spades.svg">');
	} else if (card.slice(-2,-1) === 'h') {
		$(currID).prepend('<img class="suitImg" src="img/hearts.svg">');
	} else if (card.slice(-2,-1) === 'd') {
		$(currID).prepend('<img class="suitImg" src="img/diamonds.svg">');
	} else if (card.slice(-2,-1) === 'c') {
		$(currID).prepend('<img class="suitImg" src="img/clubs.svg">');
	}
}

function calculateTotal(hand, who) {
	var total = 0;
	var cardValue = 0;
	for (i = 0; i < hand.length; i++) {
		cardValue = Number(hand[i].slice(0, -2)); // does not include the suit or color
		total += cardValue;
	}
	// update the HTML
	var idToGet = '.' + who + '-total';
	$(idToGet).html(total);
	if (total > 21){
		bust(who);
	}
}

function shuffleDeck() {
	/* function Card(color, number, suit) {
		this.color = color;
		this.number = number;
		this.suit = suit;
	} */
	// deck is made of 52 cards and 4 suits (h, s, d, c)
	// s = 1 is hearts (red), s = 2 is spades (black), s = 3 is diamonds (red), s = 4 is clubs (black)
	// outer loop creates 4 suits, either red or black
	for (s = 1; s <= 4; s++) {
		var suit = '';
		var color = '';
		if (s === 1){
			suit = 'h';
			color = 'r';
		} else if (s === 2) {
			suit = 's';
			color = 'b';
		} else if (s === 3) {
			suit = 'd';
			color = 'r';
		} else if (s === 4) {
			suit = 'c';
			color = 'b';
		}
		// inner loop creates 13 cards for each suit
		for (i = 1; i <= 13; i++) {
			/* theDeck[i] = new Card(color, i, suit); */
			theDeck.push(i + suit + color);
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
	calculateTotal(playerHand, 'player');
	placeInDeck++;
}

function stand(){
	var dealerHas = $('.dealer-total').html();
	while(dealerHas < 17) {
		if (dealerHand.length == 2) {
			slot = "three";
		} else if (dealerHand.length == 3) {
			slot = "four";
		} else if (dealerHand.length == 4) {
			slot = "five";
		} else if (dealerHand.length == 5) {
			slot = "six";
		}
		setInterval(function(){ 
			placeCard(theDeck[placeInDeck], 'dealer', slot); }, 3000);
		dealerHand.push(theDeck[placeInDeck]);
		placeInDeck++;
		calculateTotal(dealerHand, 'dealer');
		dealerHas = $('.dealer-total').html();
	}
	checkWin();
}

function checkWin() {
	var playerHas = Number($('.player-total').html());
	var dealerHas = Number($('.dealer-total').html());
	if (dealerHas > 21 && playerHas < 21) {
		bust('dealer');
	} else if (dealerHas > 16) {
		// neither player has busted and the dealer has at least 17
		if (playerHas > dealerHas) {
			// player won
			$('#message').html('You beat the dealer!');
			gameOver();
		} else if (playerHas < dealerHas) {
			// dealer won
			$('#message').html('Alas, you lost to the dealer.');
			gameOver();
		} else {
			// it's a tie
			$('#message').html('It\'s a push!');
			gameOver();
		}
	}
}

function checkWinOnDeal() {
	var playerHas = Number($('.player-total').html());
	var dealerHas = Number($('.dealer-total').html());
	console.log("Dealer has " + dealerHas);
	console.log("Player has " + playerHas);
	if (dealerHas > 21 && playerHas < 21) {
		bust('dealer');
	} else if (playerHas == 21 && dealerHas < 21) {
		$('#message').html('You beat the dealer with a blackjack!');
		gameOver();
	} else if (playerHas > 21 && dealerHas < 21) {
		bust('player');
	} else if (playerHas == 21 && dealerHas == 21) {
		$('#message').html('It\'s a push!');
		gameOver();
	}
}

function bust(who) {
	if (who === 'player') {
		$('#message').html('You have busted!');
		gameOver();
	} else {
		// it must be the dealer
		$('#message').html('The dealer has busted!');
		gameOver();
	}
}

function gameOver() {
	$('button').prop('disabled', true);
	$('#deal-button').prop('disabled', false);
}