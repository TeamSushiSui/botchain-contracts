import { expect } from "chai";
import hre from "hardhat";

describe("PayfricaLedger", function () {
  let ledger;
  let owner;
  let user;
  let nonOwner;

  beforeEach(async function () {
    [owner, user, nonOwner] = await hre.ethers.getSigners();
    const PayfricaLedger = await hre.ethers.getContractFactory("PayfricaLedger");
    ledger = await PayfricaLedger.deploy();
    await ledger.waitForDeployment();
  });

  it("Should set the correct owner", async function () {
    expect(await ledger.owner()).to.equal(owner.address);
  });

  it("Should allow the owner to log a transaction", async function () {
    const cryptoAsset = "0xaBabc7Ddc03e501d190C676BF3d92ef0e6e87a3C";
    const cryptoAmount = 1000000n;
    const fiatAmount = 150000n; // 1500.00 NGN
    const exchangeRate = 1500000000000000000000n; // 1500 * 1e18
    const usdValBasis = 1000000n; // 1.00 USD (6 decimals)
    const fiatReference = "payout-ref-123";

    await expect(
      ledger.logTransaction(
        user.address,
        0, // RAMP
        0, // COMPLETED
        cryptoAsset,
        cryptoAmount,
        fiatAmount,
        exchangeRate,
        usdValBasis,
        fiatReference
      )
    )
      .to.emit(ledger, "TransactionLogged")
      .withArgs(0n, user.address, 0, 0, fiatAmount, fiatReference);

    expect(await ledger.getGlobalCount()).to.equal(1);
    expect(await ledger.getUserTxCount(user.address)).to.equal(1);
    expect(await ledger.userVolumeUsd(user.address)).to.equal(usdValBasis);

    const record = await ledger.getUserTxByIndex(user.address, 0);
    expect(record.user).to.equal(user.address);
    expect(record.fiatReference).to.equal(fiatReference);
  });

  it("Should reject transactions logged by non-owners", async function () {
    const cryptoAsset = "0xaBabc7Ddc03e501d190C676BF3d92ef0e6e87a3C";
    await expect(
      ledger.connect(nonOwner).logTransaction(
        user.address,
        0,
        0,
        cryptoAsset,
        1000n,
        1500n,
        1500000000000000000000n,
        1000n,
        "ref"
      )
    ).to.be.revertedWithCustomError(ledger, "OwnableUnauthorizedAccount");
  });
});
