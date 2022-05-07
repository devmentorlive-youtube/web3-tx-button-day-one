import { useState, useEffect } from "react";
import { ethers, BigNumber } from "ethers";
import { useInterval } from "usehooks-ts";

import Button from "@/ui/button";

import { toWei, toEth } from "@/modules/units";

import contractAbi from "@/contracts/abi.json";

export default function Homepage() {
  const [provider, setProvider] = useState(undefined);
  const [signer, setSigner] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [balance, setBalance] = useState(BigNumber.from(0));
  const [address, setAddress] = useState(undefined);

  const [amount, setAmount] = useState(0);

  const [approving, setApproving] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const [status, setStatus] = useState("");

  useEffect(async () => {
    setProvider(new ethers.providers.Web3Provider(window.ethereum));

    setContract(
      new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        contractAbi,
        provider
      )
    );
  }, []);

  useEffect(async () => {
    if (!provider) return;

    setSigner(provider.getSigner());
  }, [provider]);

  useEffect(async () => {
    if (!signer) return;
    setAddress(await signer.getAddress());
    //setBalance(await provider.getBalance());
  }, [signer]);

  useEffect(async () => {
    if (!contract || !provider) return;

    contract.connect(provider).on("DepositEvent", handleTxEvent);
  }, [contract, provider]);

  useInterval(async () => {}, 5000);

  async function connect() {
    await provider.send("eth_requestAccounts", []);
    setSigner(provider.getSigner());
  }

  function handleTxEvent(depositor, amount, event) {
    setStatus(`Congrats, you deposited ${amount.toString()}!`);
    setTimeout(() => setStatus(""), 4000);
    setConfirming(false);
  }

  function disconnect() {
    setSigner(undefined);
    setAddress(undefined);
  }

  async function deposit() {
    console.dir({ amount });
    setApproving(true);
    const tx = await contract.connect(signer).deposit({
      value: BigNumber.from(amount),
    });
    setApproving(false);
    setConfirming(true);
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <header className="fixed top-0">
        {address ? (
          <span>
            {address}
            <Button
              onClick={disconnect}
              className="border-[1px] border-pink-700 py-2 px-8 bg-pink-600 rounded-2xl">
              disconnect
            </Button>
          </span>
        ) : (
          <Button onClick={connect}>Connect</Button>
        )}
      </header>

      <div className="bg-gray-900 p-8 border rounded-2xl border-gray-600 flex flex-col gap-4">
        <div
          className={`transition-all delay-500 w-full text-center bg-blue-500 text-white text-lg p-3 rounded-md ${
            status.length > 0 ? "opacity-100" : "opacity-0"
          }`}>
          {status}
        </div>

        <div className=" flex gap-2">
          <input
            className="border p-3 border-gray-700 bg-gray-700 text-white outline-none rounded"
            type="text"
            value={toEth(amount)}
            onChange={(e) =>
              setAmount(toWei(e.target.value.replace(/[^0-9\.]/g, "")))
            }
          />
          <Button busy={approving} onClick={deposit}>
            Deposit
          </Button>
        </div>
        <div>{approving ? <span>Approving...</span> : <></>}</div>
        <div>{confirming ? <span>Confirming...</span> : <></>}</div>
      </div>
    </div>
  );
}
