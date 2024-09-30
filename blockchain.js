// Import the SHA256 hashing function from the crypto-js library
const SHA256 = require("crypto-js/sha256");

/**
 * Class representing a single block in the blockchain.
 */
class CryptoBlock {
  /**
   * Creates a new CryptoBlock.
   * @param {number} index - The position of the block in the blockchain.
   * @param {string} timestamp - The creation time of the block.
   * @param {Object|string} data - The data contained in the block (e.g., transaction details).
   * @param {string} [precedingHash=""] - The hash of the previous block in the chain.
   */
  constructor(index, timestamp, data, precedingHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.precedingHash = precedingHash;
    this.hash = this.computeHash();
    this.nonce = 0; // Number used to satisfy the proof-of-work requirement
  }

  /**
   * Computes the SHA256 hash of the block's contents.
   * @returns {string} The computed hash as a hexadecimal string.
   */
  computeHash() {
    return SHA256(
      this.index +
        this.precedingHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

  /**
   * Performs the proof-of-work algorithm to find a hash that satisfies the difficulty criteria.
   * @param {number} difficulty - The number of leading zeros required in the hash.
   */
  proofOfWork(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.computeHash();
    }
  }
}

/**
 * Class representing the entire blockchain.
 */
class CryptoBlockchain {
  constructor() {
    this.blockchain = [this.startGenesisBlock()];
    this.difficulty = 4;
  }

  /**
   * Creates the genesis (first) block of the blockchain.
   * @returns {CryptoBlock} The genesis block.
   */
  startGenesisBlock() {
    return new CryptoBlock(0, "26/09/2024", "Initial Block in Chain", "0");
  }

  /**
   * Retrieves the latest block in the blockchain.
   * @returns {CryptoBlock} The most recent block.
   */
  obtainLatestBlock() {
    return this.blockchain[this.blockchain.length - 1];
  }

  /**
   * Adds a new block to the blockchain after performing proof-of-work.
   * @param {CryptoBlock} newBlock - The block to be added.
   */
  addNewBlock(newBlock) {
    newBlock.precedingHash = this.obtainLatestBlock().hash;
    newBlock.proofOfWork(this.difficulty);
    this.blockchain.push(newBlock);
  }

  /**
   * Validates the integrity of the blockchain.
   * @returns {boolean} True if the blockchain is valid, false otherwise.
   */
  checkChainValidity() {
    for (let i = 1; i < this.blockchain.length; i++) {
      const currentBlock = this.blockchain[i];
      const precedingBlock = this.blockchain[i - 1];

      // Check if the current block's hash is valid and matches the preceding block's hash
      const isValidHash = currentBlock.hash === currentBlock.computeHash();
      const isValidPrecedingHash =
        currentBlock.precedingHash === precedingBlock.hash;

      // If either condition is false, the chain is invalid
      if (!isValidHash || !isValidPrecedingHash) {
        return false;
      }
    }
    return true;
  }
}

let theBlockChainCoder = new CryptoBlockchain();

console.log("TheBlockChainCoder mining in process.....");
theBlockChainCoder.addNewBlock(
  new CryptoBlock(1, "29/09/2024", {
    sender: "Nikita",
    recipient: "Aleksandr",
    quantity: 50,
  })
);

theBlockChainCoder.addNewBlock(
  new CryptoBlock(2, "30/09/2024", {
    sender: "Nikita",
    recipient: "Julia",
    quantity: 100,
  })
);

console.log(JSON.stringify(theBlockChainCoder, null, 4));
