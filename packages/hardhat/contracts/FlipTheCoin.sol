// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

interface IETHOracle {
	function getETHPrice(uint256 timestamp) external view returns (uint256);
}

contract FlipTheCoin {
	IETHOracle public oracle;

	uint256 public constant FLIP_FEE_PERCENTAGE = 3;
	uint256 public constant MAX_BET_PERCENTAGE = 90;
	uint256 public constant WIN_MULTIPLIER = 150;
	uint256 public constant LOSS_MULTIPLIER = 50;
	uint256 public reserve = 0;

	struct Bet {
		address bettor;
		uint256 amount;
		bool prediction; // true for up, false for down
		uint256 timestamp;
	}

	mapping(bytes32 => Bet) public bets;
	event BetPlaced(
		bytes32 indexed betId,
		address indexed bettor,
		uint256 amount,
		bool prediction,
		uint256 timestamp
	);
	event BetResolved(bytes32 indexed betId, bool win, uint256 payout);

	constructor(address oracleAddress) {
		oracle = IETHOracle(oracleAddress);
	}

	function placeBet(bool _prediction, uint256 _amount) public payable {
		require(msg.value == _amount, "Incorrect value sent");
		require(
			_amount <= (reserve * MAX_BET_PERCENTAGE) / 100,
			"Bet amount exceeds maximum allowed"
		);

		uint256 fee = (_amount * FLIP_FEE_PERCENTAGE) / 100;
		uint256 betAmount = _amount - fee;
		reserve += fee;

		bytes32 betId = keccak256(
			abi.encodePacked(msg.sender, block.timestamp, _amount, _prediction)
		);
		bets[betId] = Bet(msg.sender, betAmount, _prediction, block.timestamp);

		emit BetPlaced(
			betId,
			msg.sender,
			betAmount,
			_prediction,
			block.timestamp
		);
	}

	function resolveBet(bytes32 _betId) public {
		Bet storage bet = bets[_betId];
		require(
			msg.sender == bet.bettor,
			"Only the bettor can resolve the bet"
		);

		uint256 currentPrice = oracle.getETHPrice(bet.timestamp);
		uint256 futurePrice = oracle.getETHPrice(block.timestamp);

		bool win = (futurePrice > currentPrice) == bet.prediction;
		uint256 payout = win
			? (bet.amount * WIN_MULTIPLIER) / 100
			: (bet.amount * LOSS_MULTIPLIER) / 100;

		payable(bet.bettor).transfer(payout);
		reserve -= payout;

		emit BetResolved(_betId, win, payout);

		// Clean up the bet
		delete bets[_betId];
	}

	function addFunds() public payable {
		reserve += msg.value;
	}

	function withdrawFunds() public {
		require(msg.sender == address(this));
		payable(msg.sender).transfer(reserve);
		reserve = 0;
	}
}
