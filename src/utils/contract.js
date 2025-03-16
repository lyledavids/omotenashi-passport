import { ethers } from "ethers";
import contractABI from "./abi.json";

const provider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_RPC_URL);
const signer = provider.getSigner();
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

const contract = new ethers.Contract(contractAddress, contractABI, signer);

export default contract;
