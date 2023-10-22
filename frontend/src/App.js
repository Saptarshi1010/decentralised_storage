import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import { useState, useEffect } from "react";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import "./App.css";
const ethers = require("ethers");

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const loadProvider = async () => {
      if (!window.ethereum) {
        console.error("MetaMask is not installed or not accessible.");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
      let contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

      const contract = new ethers.Contract(
        contractAddress,
        Upload.abi,
        signer
      );

      setContract(contract);
      setProvider(provider);
    };

    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });

      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });

      window.ethereum.request({ method: "eth_requestAccounts" }).then((accounts) => {
        if (accounts.length > 0) {
          loadProvider();
        }
      });
    } else {
      console.error("MetaMask is not installed or not accessible.");
    }
  }, []);

  return (
    <>
      {!modalOpen && (
        <button className="share" onClick={() => setModalOpen(true)}>
          Share
        </button>
      )}
      {modalOpen && (
        <Modal setModalOpen={setModalOpen} contract={contract}></Modal>
      )
      }

      <div className="App">
        <h1 style={{ color: "white" }}>Decentralized Storage</h1>
        <div className="bg"></div>
        <div className="bg bg2"></div>
        <div className="bg bg3"></div>

        <p style={{ color: "white" }}>
          Account: {account ? account : "Not connected"}
        </p>
        <FileUpload
          account={account}
          provider={provider}
          contract={contract}
        ></FileUpload>
        <Display contract={contract} account={account}></Display>
      </div>
    </>
  )
}

export default App;
