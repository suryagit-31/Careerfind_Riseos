import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, Wallet } from "lucide-react";
import { useWeb3 } from "../context/web3Context";
import { useAuthStore } from "../store/authStore";
import axios from "axios";

const WalletLogin = () => {
  const navigate = useNavigate();
  const { connectMetaMask, connectPhantom, account, solanaAccount } = useWeb3();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleWalletAuth = async (network) => {
    setIsLoading(true);
    setError("");

    try {
      let address = "";

      if (network === "ethereum") {
        await connectMetaMask();
        address = account || "";
      } else if (network === "solana") {
        await connectPhantom();
        address = solanaAccount || "";
      }

      if (!address) {
        throw new Error("Failed to connect wallet");
      }

      // Get nonce for signing
      const nonceResponse = await axios.post("/api/web3/wallet-nonce", {
        address,
      });
      const { message } = nonceResponse.data;

      // Sign message
      let signature = "";
      if (network === "ethereum" && window.ethereum) {
        signature = await window.ethereum.request({
          method: "personal_sign",
          params: [message, address],
        });
      } else if (network === "solana" && window.solana) {
        const encodedMessage = new TextEncoder().encode(message);
        const signedMessage = await window.solana.signMessage(
          encodedMessage,
          "utf8"
        );
        signature = Array.from(signedMessage.signature).toString();
      }

      // Authenticate with backend
      const authResponse = await axios.post("/api/web3/wallet-login", {
        address,
        signature,
        message,
        network,
      });

      const { user, token } = authResponse.data;

      // Update auth store
      login(user.email, "", token, user);
      navigate("/jobs");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Failed to authenticate with ${network} wallet`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <Briefcase className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-neutral-900">
              Career Find
            </span>
          </Link>
          <h2 className="text-3xl font-bold text-neutral-900">
            Connect Your Wallet
          </h2>
          <p className="text-neutral-600 mt-2">Sign in with your Web3 wallet</p>
        </div>

        <div className="card">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={() => handleWalletAuth("ethereum")}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-3 p-4 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50"
            >
              <Wallet className="h-6 w-6 text-primary" />
              <div className="text-left">
                <p className="font-medium text-neutral-900">MetaMask</p>
                <p className="text-sm text-neutral-600">Ethereum & Polygon</p>
              </div>
            </button>

            <button
              onClick={() => handleWalletAuth("solana")}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-3 p-4 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50"
            >
              <Wallet className="h-6 w-6 text-secondary-dark" />
              <div className="text-left">
                <p className="font-medium text-neutral-900">Phantom</p>
                <p className="text-sm text-neutral-600">Solana</p>
              </div>
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-neutral-600">
              Prefer email?{" "}
              <Link
                to="/login"
                className="text-primary hover:text-accent font-medium"
              >
                Sign in with email
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletLogin;
