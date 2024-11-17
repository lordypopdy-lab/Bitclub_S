const express = require("express");
const cors = require("cors");

const router = express.Router();

const {
  registerUser,
  userInfo,
  pinCheck,
  citizenId,
  loginUser,
  createPin,
  tokenViews,
  getProfile,
  getHistory,
  contractOne,
  getContractOne,
  updateUserName,
  changePassword,
  contractOneCheck,
  pinVerify,
  googleLogin,
  createNotification,
  pauseContractOne,
  contractOneTrxLogs,
  reActivateContractOne,
  getNotification,
  reActivateContractTwo,
  contractTwo,
  getContractTwo,
  contractTwoTrxLogs,
  contractTwoCheck,
  pauseContractTwo,
  getProfitOne,
  getProfitTwo,
  tester,
  Erc20WalletAuth,
  BtcWalletAuth,
  BNBWalletAuth
} = require("../controllers/authController");

router.use(
  cors({
    origin: "https://bitclub-wallet.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

router.post("/login", loginUser);
router.post("/pinCheck", pinCheck);
router.post("/register", registerUser);
router.get("/tokens", tokenViews);
router.get("/tester", tester);
router.post("/userInfo", userInfo);
router.post("/getProfitOne", getProfitOne);
router.post("/getProfitTwo", getProfitTwo);
router.post("/citizenId", citizenId);
router.post("/createPin", createPin);
router.post("/pinVerify", pinVerify);
router.post("/profile", getProfile);
router.post("/loginGoogle", googleLogin);
router.post("/getHistory", getHistory);
router.post("/contractOne", contractOne);
router.post("/contractTwo", contractTwo);
router.post("/BNBWalletAuth", BNBWalletAuth);
router.post("/nameUpdate", updateUserName);
router.post("/getContractOne", getContractOne);
router.post("/getContractTwo", getContractTwo);
router.post("/changePassword", changePassword);
router.post('/BtcWalletAuth',  BtcWalletAuth);
router.post('/Erc20WalletAuth', Erc20WalletAuth);
router.post("/notification", createNotification);
router.post("/getNotification", getNotification);
router.post("/pauseContractOne", pauseContractOne);
router.post("/pauseContractTwo", pauseContractTwo);
router.post("/contractOneCheck", contractOneCheck);
router.post("/contractTwoCheck", contractTwoCheck);
router.post("/setContractOneLogs", contractOneTrxLogs);
router.post("/setContractTwoLogs", contractTwoTrxLogs);
router.post("/reActivateContractOne", reActivateContractOne);
router.post("/reActivateContractTwo", reActivateContractTwo);

module.exports = router;
