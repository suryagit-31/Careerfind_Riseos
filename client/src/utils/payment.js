// utils/payments.js
import { ethers } from "ethers";
import toast from "react-hot-toast";

const PLATFORM_ADDRESS = "0xB96f9B202807AdDfEDfCC6Ab21F0613A3b16e24e"; // Replace with your platform's ETH address
const PLATFORM_FEE_ETH = "0.00"; // Example fee (ETH)

export async function sendPlatformFee() {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask not detected");
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();

    const tx = await signer.sendTransaction({
      to: PLATFORM_ADDRESS,
      value: ethers.utils.parseEther(PLATFORM_FEE_ETH), // Convert to Wei
    });

    console.log("Platform fee sent:", tx.hash);

    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt.transactionHash);
    toast.success("Platform fee sent successfully");
    return receipt;
  } catch (error) {
    console.error("Error sending platform fee:", error);
    if (error.code === 4001 || error.code === "ACTION_REJECTED") {
      // Explicitly tell the UI it was user denied
      toast.error("User denied payment");
      throw new Error("PAYMENT_DENIED");
    }
    throw error;
  }
}
