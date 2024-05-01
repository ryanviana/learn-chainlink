// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

interface IETHOracle {
	function checkEthValueAtTime(
		uint256 timestamp
	) external view returns (uint256 ethPrice, bool exists);
}

contract FlipTheCoin {
	IETHOracle public oracle;

	uint256 public constant FLIP_FEE_PERCENTAGE = 3;
	uint256 public constant MAX_BET_PERCENTAGE = 90;
	uint256 public constant WIN_MULTIPLIER = 150;
	uint256 public constant LOSS_MULTIPLIER = 50;
	uint256 public reserve = 0;

	struct Bet {
		uint256 amount;
		bool prediction;
		uint256 timestamp;
		uint256 priceAtBetTime;
	}

	mapping(address => Bet[]) public betsByAddress;

	event BetPlaced(
		address indexed bettor,
		uint256 indexed betIndex,
		uint256 amount,
		bool prediction,
		uint256 timestamp,
		uint256 priceAtBetTime
	);

	event BetResolved(
		address indexed bettor,
		uint256 indexed betIndex,
		bool win,
		uint256 payout
	);

	constructor(address oracleAddress) payable {
		oracle = IETHOracle(oracleAddress);
		reserve += msg.value;
	}

	function getNumberOfBets(address bettor) public view returns (uint) {
		return betsByAddress[bettor].length;
	}

	function placeBet(
		bool _prediction,
		uint256 _amount,
		uint256 _timestamp
	) public payable {
		require(msg.value == _amount, "Incorrect value sent");
		require(
			_amount <= (reserve * MAX_BET_PERCENTAGE) / 100,
			"Bet amount exceeds maximum allowed"
		);

		uint256 fee = (_amount * FLIP_FEE_PERCENTAGE) / 100;
		uint256 betAmount = _amount - fee;
		reserve += fee;

		(uint256 priceAtBetTime, bool priceExists) = oracle.checkEthValueAtTime(
			_timestamp
		);
		require(priceExists, "Price data not available at bet time");

		betsByAddress[msg.sender].push(
			Bet(betAmount, _prediction, _timestamp, priceAtBetTime)
		);

		emit BetPlaced(
			msg.sender,
			betsByAddress[msg.sender].length - 1,
			betAmount,
			_prediction,
			_timestamp,
			priceAtBetTime
		);
	}

	function resolveBet(uint256 _betIndex, uint256 _timestamp) public {
		require(
			_betIndex < betsByAddress[msg.sender].length,
			"Bet index out of range"
		);

		Bet storage bet = betsByAddress[msg.sender][_betIndex];
		(uint256 futurePrice, bool futurePriceExists) = oracle
			.checkEthValueAtTime(_timestamp);
		require(
			futurePriceExists,
			"Price data not available at resolution time"
		);

		bool win = (futurePrice > bet.priceAtBetTime) == bet.prediction;
		uint256 payout = win
			? (bet.amount * WIN_MULTIPLIER) / 100
			: (bet.amount * LOSS_MULTIPLIER) / 100;

		payable(msg.sender).transfer(payout);
		reserve -= payout;

		emit BetResolved(msg.sender, _betIndex, win, payout);

		// Optionally clean up the bet to prevent re-resolution
		delete betsByAddress[msg.sender][_betIndex];
	}
}
