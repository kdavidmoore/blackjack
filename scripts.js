var theDeck = [];

$(document).ready(function() {
	// set up a click listener on all buttons
	$('button').click(function() {
		var clickedButton = alert($(this).attr('id'));
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
	theDeck = shuffleDeck();
}

function shuffleDeck() {
	// deck is made of 52 cards and 4 suits (h, s, d, c)
	// s = 1 is hearts, s = 2 is spades, s = 3 is diamonds, s = 4 is clubs
	// outer loop creates 4 suits
	for (s=1; s<=4; s++) {
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
		for (i=1; i<=13; i++) {
			theDeck.push(i + suit);
		}
	}
	console.log(theDeck);
}