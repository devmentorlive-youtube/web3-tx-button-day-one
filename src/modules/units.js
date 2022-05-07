import { ethers } from "ethers";

export function toEth(value, decimals = 3) {
  const ether = parseFloat(ethers.utils.formatEther(value.toString()))
    .toFixed(decimals)
    .replace(/[\.]?[0]+$/, "");
  return parseFloat(ether).toLocaleString("en-US");
}

export function toWei(value) {
  return ethers.utils.parseEther(value.toString());
}
