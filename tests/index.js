const { CryptoRpc } = require("../");
const assert = require("assert");
const mocha = require("mocha");
const { before, describe, it } = mocha;
const TestForCurrency = require("./generic-tests");

const currencyConfig = {
  ETH: {
    host: "ganache",
    protocol: "http",
    rpcPort: "8545",
    currencyConfig: {
      sendTo: "0x0000000000000000000000000000000000000000",
      unlockPassword: "",
      account: "0xd8fd14fb0e0848cb931c1e54a73486c4b968be3d",
      rawTx:
        "0xf8978202e38471a14e6382ea6094000000000000000000000000000000000000000080b244432d4c353a4e2b4265736a3770445a46784f6149703630735163757a382f4f672b617361655a3673376543676b6245493d26a04904c712736ce12808f531996007d3eb1c1e1c1dcf5431f6252678b626385e40a043ead01a06044cd86fba04ae1dc5259c5b3b5556a8bd86aeb8867e8f1e41512a"
    }
  },
  BTC: {
    host: "bitcoin",
    protocol: "http",
    rpcPort: "8333",
    user: "cryptorpc",
    pass: "local321",
    currencyConfig: {
      sendTo: "2NGFWyW3LBPr6StDuDSNFzQF3Jouuup1rua",
      unlockPassword: "password",
      rawTx:
        "0100000001641ba2d21efa8db1a08c0072663adf4c4bc3be9ee5aabb530b2d4080b8a41cca000000006a4730440220062105df71eb10b5ead104826e388303a59d5d3d134af73cdf0d5e685650f95c0220188c8a966a2d586430d84aa7624152a556550c3243baad5415c92767dcad257f0121037aaa54736c5ffa13132e8ca821be16ce4034ae79472053dde5aa4347034bc0a2ffffffff0240787d010000000017a914c8241f574dfade4d446ec90cc0e534cb120b45e387eada4f1c000000001976a9141576306b9cc227279b2a6c95c2b017bb22b0421f88ac00000000"
    }
  }
};

describe("ETH Tests", function() {
  const config = currencyConfig.ETH;
  const rpcs = new CryptoRpc(config, config.currencyConfig);
  this.timeout(10000);

  before(done => {
    setTimeout(done, 5000);
  });

  it("should estimate fee", async () => {
    const fee = await rpcs.estimateFee("ETH", 4);
    assert(fee);
  });

  it("should return an array of all tx of an address", async () => {
    const txList = await rpcs.getInternalEthTransactions(
      "ETH",
      config.currencyConfig.account
    );
    assert(txList);
  });

  TestForCurrency("ETH", currencyConfig);
});

describe("BTC Tests", function() {
  this.timeout(10000);
  const config = currencyConfig.BTC;
  const rpcs = new CryptoRpc(config, config.currencyConfig);
  const bitcoin = rpcs.get("BTC");

  before(async () => {
    try {
      await bitcoin.asyncCall("encryptWallet", ["password"]);
    } catch (e) {
      console.warn("wallet already encrypted");
    }
    await new Promise(resolve => setTimeout(resolve, 5000));
    await bitcoin.asyncCall("generate", [101]);
  });

  TestForCurrency("BTC", currencyConfig);
});
