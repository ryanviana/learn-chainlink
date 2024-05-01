"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { NextPage } from "next";
import { useTheme } from "next-themes";
import { parseEther } from "viem";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const FlipTheCoin: NextPage = () => {
  const coinImage = "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880";
  const [betAmount, setBetAmount] = useState(0);
  const [prediction, setPrediction] = useState(true);
  const [flipping, setFlipping] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [result, setResult] = useState<string | null>(null);
  const [imageRotation, setImageRotation] = useState("0deg");
  const [betIndex, setBetIndex] = useState<number | null>(null);

  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract("FlipTheCoin");

  const { data: numberOfBets } = useScaffoldReadContract({
    contractName: "FlipTheCoin",
    functionName: "getNumberOfBets",
    args: ["0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"],
    watch: true,
  });

  useEffect(() => {
    if (numberOfBets !== undefined) {
      setBetIndex(numberOfBets > 0 ? Number(BigInt(numberOfBets) - BigInt(1)) : null);
    }
  }, [numberOfBets]);

  useEffect(() => {
    if (flipping) {
      const timer = setInterval(() => {
        setCountdown(prevCountdown => {
          if (prevCountdown <= 1) {
            clearInterval(timer);
            setShowResults(true);
            setFlipping(false);
            return 60;
          }
          return prevCountdown - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [flipping]);

  useEffect(() => {
    setImageRotation(prediction ? "0deg" : "180deg");
  }, [prediction]);

  const startGuess = async () => {
    if (!flipping) {
      setFlipping(true);
      setShowResults(false);
      setResult(null);
      setCountdown(60);

      const timestamp = Math.floor(Date.now() / 1000); // Current UNIX timestamp

      try {
        const weiValue = parseEther(betAmount.toString());

        await writeYourContractAsync({
          functionName: "placeBet",
          args: [prediction, weiValue, BigInt(timestamp)],
          value: weiValue,
        });
      } catch (e) {
        console.error("Error placing bet:", e);
        setFlipping(false);
      }
    }
  };

  const resolveGuess = async () => {
    if (betIndex !== null) {
      const timestamp = Math.floor(Date.now() / 1000);
      try {
        const result = await writeYourContractAsync({
          functionName: "resolveBet",
          args: [BigInt(betIndex), BigInt(timestamp)],
        });
        console.log(result); // Process or display the result accordingly
      } catch (e) {
        console.error("Error resolving bet:", e);
      }
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen ${isDarkMode ? "bg-gray-750" : "bg-gray-200"}`}
    >
      <div className={`max-w-7xl mx-auto p-8 ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-2xl rounded-2xl my-10`}>
        <h1 className={`text-4xl font-bold text-center ${isDarkMode ? "text-white" : "text-gray-900"} mb-10`}>
          Flip The Coin
        </h1>
        <div className="flex flex-col items-center">
          <div className="flex gap-4 mb-4">
            <button
              className={`btn ${prediction ? "btn-primary" : "btn-outline"} w-32`}
              onClick={() => setPrediction(true)}
            >
              Up
            </button>
            <button
              className={`btn ${!prediction ? "btn-primary" : "btn-outline"} w-32`}
              onClick={() => setPrediction(false)}
            >
              Down
            </button>
          </div>
          {!flipping && (
            <div className="mb-4 w-full max-w-xs">
              <input
                type="text"
                value={betAmount}
                onChange={e => setBetAmount(Number(e.target.value))}
                placeholder="Enter bet amount"
                className="input input-bordered input-primary w-full"
              />
            </div>
          )}
          <div className="relative mt-4">
            <Image
              src={coinImage}
              alt="Flip Coin"
              className={`cursor-pointer ${flipping ? "opacity-70" : "opacity-100"}`}
              style={{ transition: "opacity 0.5s ease, transform 0.8s", transform: `rotate(${imageRotation})` }}
              width={192} // Adjust the width as needed
              height={192} // Adjust the height as needed
            />
            {flipping && (
              <div
                className={`absolute top-0 left-0 w-full h-full flex items-center justify-center text-xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                } backdrop-blur-md`}
                style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
              >
                {countdown}
              </div>
            )}
          </div>
          <button className="btn btn-primary mt-4 mb-4" onClick={startGuess}>
            Start Timer
          </button>
          {showResults && (
            <div className="mt-4">
              <button className="btn btn-success" onClick={resolveGuess}>
                Resolve Bet
              </button>
              {result && (
                <div className={`text-2xl font-bold mt-2 ${result === "Win" ? "text-green-500" : "text-red-500"}`}>
                  {result}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlipTheCoin;
