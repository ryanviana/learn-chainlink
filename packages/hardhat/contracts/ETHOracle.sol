// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import { FunctionsClient } from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import { ConfirmedOwner } from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import { FunctionsRequest } from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";

contract ETHOracle is FunctionsClient, ConfirmedOwner {
	using FunctionsRequest for FunctionsRequest.Request;

	string public source;
	bytes32 public s_lastRequestId;
	bytes public s_lastResponse;
	bytes public s_lastError;

	mapping(uint256 => uint256) public timeToEthValue;

	error UnexpectedRequestID(bytes32 requestId);

	event Response(
		bytes32 indexed requestId,
		uint256 ethPrice,
		uint256 timestamp,
		bytes err
	);

	constructor(
		address router,
		string memory _source
	) FunctionsClient(router) ConfirmedOwner(msg.sender) {
		source = _source;
	}

	function sendRequest(
		bytes memory encryptedSecretsUrls,
		uint8 donHostedSecretsSlotID,
		uint64 donHostedSecretsVersion,
		string[] memory args,
		bytes[] memory bytesArgs,
		uint64 subscriptionId,
		uint32 gasLimit,
		bytes32 donID
	) external onlyOwner returns (bytes32 requestId) {
		FunctionsRequest.Request memory req;
		req.initializeRequestForInlineJavaScript(source);
		if (encryptedSecretsUrls.length > 0)
			req.addSecretsReference(encryptedSecretsUrls);
		else if (donHostedSecretsVersion > 0) {
			req.addDONHostedSecrets(
				donHostedSecretsSlotID,
				donHostedSecretsVersion
			);
		}
		if (args.length > 0) req.setArgs(args);
		if (bytesArgs.length > 0) req.setBytesArgs(bytesArgs);
		s_lastRequestId = _sendRequest(
			req.encodeCBOR(),
			subscriptionId,
			gasLimit,
			donID
		);
		return s_lastRequestId;
	}

	function sendRequestCBOR(
		bytes memory request,
		uint64 subscriptionId,
		uint32 gasLimit,
		bytes32 donID
	) external onlyOwner returns (bytes32 requestId) {
		s_lastRequestId = _sendRequest(
			request,
			subscriptionId,
			gasLimit,
			donID
		);
		return s_lastRequestId;
	}

	function fulfillRequest(
		bytes32 requestId,
		bytes memory response,
		bytes memory err
	) internal override {
		if (s_lastRequestId != requestId) {
			revert UnexpectedRequestID(requestId);
		}
		s_lastResponse = response;
		s_lastError = err;

		// uint256 ethPrice = abi.decode(response, (uint256));

		(uint256 ethPrice, uint256 timestamp) = abi.decode(
			response,
			(uint256, uint256)
		);

		timeToEthValue[timestamp] = ethPrice;

		emit Response(requestId, ethPrice, timestamp, s_lastError);
	}

	function checkEthValueAtTime(
		uint256 timestamp
	) public view returns (uint256 ethPrice, bool exists) {
		ethPrice = timeToEthValue[timestamp];
		exists = ethPrice != 0 || timestamp <= block.timestamp;
		return (ethPrice, exists);
	}
}
