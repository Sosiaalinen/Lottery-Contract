const { ethers } = require("hardhat")
const fs = require("fs")
const FRONT_END_ADDRESSES_FILE = "../next-js-sc-lottery/constants/coads.json"
const FRONT_END_ABI_FILE = "../next-js-sc-lottery/constants/abi.json"

module.exports = async function () {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating front end...")
        updateContractAddresses()
        updateAbi()
        console.log("front end updated")
    }
}

async function updateAbi() {
    const lottery = await ethers.getContract("Lottery")
    fs.writeFileSync(FRONT_END_ABI_FILE, lottery.interface.format(ethers.utils.FormatTypes.json))
}

async function updateContractAddresses(network) {
    const lottery = await ethers.getContract("Lottery")
    const coads = JSON.parse(fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf-8"))
    const chainId = network.config.chainId.toString()
    if (chainId in coads) {
        if (!coads[chainId].includes(lottery.address)) {
            coads[chainId].push(lottery.address)
        }
    } else {
        coads[chainId] = [lottery.address]
    }
    fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(coads))
}

module.exports.tags = ["all", "frontend"]
