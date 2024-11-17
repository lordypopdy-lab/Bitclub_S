const User = require("../models/user");
const { hashPassword, comparePassword } = require("../helpers/auth");
const jwt = require("jsonwebtoken");
const UserContractOne = require("../models/contractOne");
const UserSecurity = require("../models/checkPin");
const PauseLogs = require("../models/trxHistory");
const NotificationModel = require("../models/notification");
const history = require("../models/history");
const notificationModel = require("../models/notification");
const userInfomation = require("../models/userInformation");
const Admin = require("../models/AdminModel/admin");
const ContractTwo = require("../models/contractTwo");
const Erc20Wallet = require("../models/Erc20Wallet");
const BtcWallet = require("../models/BtcWallet");
const BNBWallet = require("../models/BNBWallet")
const { ethers } = require("ethers");

const CoinKey = require('coinkey'); 

/////////////////////////-----GENERAL FUNCTIONALITY SECTION-----///////////////////////////////
/////////////////////////---------------------------------------///////////////////////////////
/////////////////////////---------------------------------------///////////////////////////////
/////////////////////////---------------------------------------///////////////////////////////

const Erc20WalletAuth = async (req, res) => {
  const { email } = req.body;

  const checkErc20 = await Erc20Wallet.findOne({ email: email });

  if (checkErc20) {
    return res.json({
      address: checkErc20.walletAddress,
    });
  }

  if (!checkErc20) {
    try {
      const wallet = ethers.Wallet.createRandom();
      Erc20Wallet.create({
        email: email,
        privateKey: wallet.privateKey,
        walletAddress: wallet.address,
      });

      // console.log(`Wallet Address: ${wallet.address}`);
      // console.log(`PrivateKey: ${wallet.privateKey}`);

      return res.json({
        address: wallet.address,
      });
    } catch (error) {
      return res.json({
        error: error,
      });
    }
  }
};

const BtcWalletAuth = async (req, res) => {
  const { email } = req.body;

  const checkBtcAddrr = await BtcWallet.findOne({ email: email });

  if (checkBtcAddrr) {
    return res.json({
        address: checkBtcAddrr.walletAddress
    })
  }


  if (!checkBtcAddrr) {

    var wallet = new CoinKey.createRandom();

    // console.log("SAVE BUT DO NOT SHARE THIS:", wallet.privateKey.toString('hex'));
    // console.log("Address:", wallet.publicAddress);

    const createAdrr = await BtcWallet.create({
      email: email,
      privateKey: wallet.privateKey.toString('hex'),
      walletAddress: wallet.publicAddress
  })

  if(createAdrr){
      return res.json({ address: wallet.publicAddress });
  }
   }

};

const BNBWalletAuth = async (req, res) =>{

  const { email } = req.body;

  const checkBNB = await BNBWallet.findOne({ email: email });

  if (checkBNB) {
    return res.json({
      address: checkBNB.walletAddress,
    });
  }

  if (!checkBNB) {
    try {
      const wallet = ethers.Wallet.createRandom();
      BNBWallet.create({
        email: email,
        privateKey: wallet.privateKey,
        walletAddress: wallet.address,
      });

      // console.log(`Wallet Address: ${wallet.address}`);
      // console.log(`PrivateKey: ${wallet.privateKey}`);

      return res.json({
        address: wallet.address,
      });
    } catch (error) {
      return res.json({
        error: error,
      });
    }
  }

}

/////////////////////////-----REGISTERATION AND AUTHERIZATION SECTION-----///////////////////////////////
/////////////////////////-------------------------------------------------///////////////////////////////
/////////////////////////-------------------------------------------------///////////////////////////////
/////////////////////////-------------------------------------------------///////////////////////////////
const googleLogin = async (req, res) => {
  const { email, name, picture } = req.body;
  if (email && name) {
    const check = await User.findOne({ email });
    if (check) {
      const update = await User.updateOne(
        { email: email },
        { $set: { email: `${email}`, name: `${name}`, picture: `${picture}` } }
      );
      if (update) {
        return res.json(check);
      } else {
        console.log("Error Updating");
      }
    }
    const user = await User.create({
      picture: picture,
      citizenId: "",
      verification: "Unverified",
      name,
      email,
      NotificationSeen: 0,
    });
    const adminTotalUserUpdate = await Admin.updateOne(
      { adminEmail: "bitclubcontract@gmail.com" },
      { $inc: { totalUser: 1 } }
    );
    if (user && adminTotalUserUpdate) {
      return res.json(user);
    }
  }
};

const userInfo = async (req, res) => {
  const { email, Id, Country } = req.body;
  const check = await userInfomation.findOne({ email });
  if (check) {
    const update = await userInfomation.updateOne(
      { email: email },
      { $set: { email: `${email}`, Id: `${Id}`, Country: `${Country}` } }
    );
    if (update) {
      return res.json({
        message: "Updated",
      });
    }
  }
  const create = await userInfomation.create({
    email,
    Id,
    Country,
  });
  if (create) {
    return res.json({
      message: "success",
    });
  }
};

const citizenId = async (req, res) => {
  const { email, imgSrc } = req.body;
  const updateUserPic = await userInfomation.updateOne(
    { email: email },
    { $set: { IdProfile: imgSrc } }
  );
  const updateUser = await User.updateOne(
    { email: email },
    { $set: { citizenId: `${imgSrc}`, verification: `Inreview` } }
  );
  if (updateUser && updateUserPic) {
    return res.json({
      success: "Success",
    });
  }
};

const getNotification = async (req, res) => {
  const { email } = req.body;
  try {
    const notificationList = await notificationModel.find({ email });
    if (notificationList) {
      return res.json({
        notificationList,
      });
    } else {
      return res.json({
        error: "Empty History",
      });
    }
  } catch (error) {
    return res.json({
      Error: error,
    });
  }
};

const getHistory = async (req, res) => {
  const { email } = req.body;
  try {
    const historyList = await history.find({ email });
    if (historyList) {
      return res.json({
        historyList,
      });
    } else {
      return res.json({
        message: "Empty History",
      });
    }
  } catch (error) {
    return res.json({
      Error: error,
    });
  }
};

const pinVerify = async (req, res) => {
  const { pin1, pin2, pin3, pin4, email } = req.body;
  if (!pin1) {
    return res.json({
      error: "All PIN fields is required!",
    });
  }

  if (!pin2) {
    return res.json({
      error: "All PIN fields is required!",
    });
  }

  if (!pin3) {
    return res.json({
      error: "All PIN fields is required!",
    });
  }

  if (!pin4) {
    return res.json({
      error: "All PIN fields is required!",
    });
  }

  const userPin = await UserSecurity.findOne({ email });
  const PIN = pin1 + pin2 + pin3 + pin4;
  const matchCorrect = await comparePassword(PIN, userPin.pin);
  if (matchCorrect) {
    return res.json({
      success: "PIN match Successfuly",
    });
  } else {
    return res.json({
      error: "Wrong PIN Provided",
    });
  }
};

const createPin = async (req, res) => {
  const { pin1, pin2, pin3, pin4, email } = req.body;
  if (!pin1) {
    return res.json({
      error: "All PIN fields is required!",
    });
  }

  if (!pin2) {
    return res.json({
      error: "All PIN fields is required!",
    });
  }

  if (!pin3) {
    return res.json({
      error: "All PIN fields is required!",
    });
  }

  if (!pin4) {
    return res.json({
      error: "All PIN fields is required!",
    });
  }
  const PIN = pin1 + pin2 + pin3 + pin4;
  const pin = await hashPassword(PIN);
  if (pin) {
    const createPIN = await UserSecurity.create({ email, pin });
    if (createPIN) {
      return res.json({
        success: "PIN Created successfuly!",
      });
    } else {
      return res.json({
        error: "Error Creating PIN",
      });
    }
  }
};

const pinCheck = async (req, res) => {
  const { email } = req.body;
  const exist = await UserSecurity.findOne({ email });
  if (exist) {
    return res.json({
      exists: true,
    });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, comfirmPassword } = req.body;
    //Check if name was taken
    if (!name) {
      return res.json({
        error: "name is required",
      });
    }

    //Check if password is goood
    if (!password || password.length < 6) {
      return res.json({
        error: "password is required and should be atleast six(6) characters",
      });
    }

    //Check comfirmPassword
    if (password !== comfirmPassword) {
      return res.json({
        error: "Comfirm password must match password",
      });
    }
    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({
        error: "email is taken",
      });
    }

    const adminTotalUserUpdate = await Admin.updateOne(
      { adminEmail: "bitclubcontract@gmail.com" },
      { $inc: { totalUser: 1 } }
    );
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      picture: "",
      citizenId: "",
      verification: "Unverified",
      name,
      email,
      password: hashedPassword,
      NotificationSeen: 0,
    });

    if (adminTotalUserUpdate && user) {
      return res.json(user);
    }
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    //Check if user exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: "No user found",
      });
    }
    //Check if password match
    const match = await comparePassword(password, user.password);
    if (match) {
      jwt.sign(
        { name: user.name, email: user.email, id: user._id },
        process.env.JWT_SECRET,
        {},
        (error, token) => {
          if (error) throw error;
          res.cookie("token", token).json(user);
        }
      );
    }
    if (!match) {
      return res.json({
        error:
          "password not match our database, password should be atleast six(6) character",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const getProfile = async (req, res) => {
  const { email, pin } = req.body;

  const user = await User.findOne({ email });
  const pin_match = user._id;
  if (user && pin == pin_match) {
    res.json(user);
  } else {
    res.json({
      error: "Error access",
    });
  }
};

const updateUserName = async (req, res) => {
  try {
    const { name, email } = req.body;
    console.log(name);
    const user = await User.findOne({ email });
    if (user) {
      const update = await User.updateOne(
        { email: email },
        { $set: { name: `${name}` } }
      );
      if (update) {
        res.json({
          message: "name update was successfuly!",
        });
      } else {
        res.json({
          error: "unable to update username",
        });
      }
    } else {
      res.json({
        error: "user not found",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const changePassword = async (req, res) => {
  try {
    const { email, current, newPassword, comfirmNewPassword } = req.body;
    const user = await User.findOne({ email });

    if (!email) {
      return res.json({
        error: "unidentify user",
      });
    }

    if (!current) {
      return res.json({
        error: "current password is required to complete the proccess",
      });
    }

    if (!newPassword) {
      return res.json({
        error: "new password field is required",
      });
    }

    if (newPassword.length < 8) {
      return res.json({
        error: "password is required and should be atleast six(8) chars",
      });
    }

    if (!comfirmNewPassword) {
      return res.json({
        error:
          "comfirm password is required and should be atleast six(8) chars",
      });
    }

    if (newPassword !== comfirmNewPassword) {
      return res.json({
        error: "new password must match comfirm password",
      });
    }

    const comfirmPassword = await comparePassword(current, user.password);

    if (comfirmPassword) {
      hashNew = await hashPassword(newPassword);
      const updatePassword = await User.updateOne(
        { email: email },
        { $set: { password: `${hashNew}` } }
      );
      if (updatePassword) {
        return res.json({
          success: "password update was successfuly",
        });
      } else {
        return res.json({
          error: "password update error",
        });
      }
    } else {
      return res.json({
        error: "current password did not match our database",
      });
    }
  } catch (error) {
    throw error;
  }
};

/////////////////////////-----GENERAL FUNCTIONALITY SECTION-----///////////////////////////////
/////////////////////////---------------------------------------///////////////////////////////
/////////////////////////---------------------------------------///////////////////////////////
/////////////////////////---------------------------------------///////////////////////////////

const createNotification = async (req, res) => {
  const { email, For } = req.body;

  const NotificationList = {
    activationHeader: "Contract Activated! 🎉",
    activationMessage:
      "Your contract has been successfully ✅ activated.We are excited 😍 to support you and ensure a seamless experience. Enjoy the benefits of your new contract!",
    reActivationHeader: "Contract Reactivated! 🎉",
    reActivationMessage:
      "Your contract has been successfully ✅ reactivated. We are thrilled 😇 to have you back! Enjoy the continued benefits and services. Thank you for choosing us again!",
    pauseAndWithdrawHeader: "Contract Paused and Withdrawn! 🎉",
    pauseAndWithdrawMessage:
      "Your contract has been successfully ✅ paused and withdrawn",
    sendHeader: "Success! 👍",
    sendMessage: "Ethers has been sent successfully. Transaction completed ✅",
    getProfitHeader: "Success! 👍",
    getProfitMessage:
      "Ethers has been sent successfully. Profit withdrawn successfully. Transaction completed ✅",
    verificationHeader: "Submitted Successfully! ✅",
    verificationMessage:
      "Thank you for submitting your ID for verification. We have received your documents, and they are currently under review. You will be notified once the verification process is complete.",
  };

  const timestamp = new Date().getTime();

  if (email && For == "ForcontractActivation") {
    const createNew = await NotificationModel.create({
      email,
      For: For,
      message: NotificationList.activationMessage,
      header: NotificationList.activationHeader,
      timestamp: timestamp,
    });

    const user = await User.findOne({ email });
    const updateUserNotification = await User.updateOne(
      { email: email },
      { $set: { NotificationSeen: `${1 + user.NotificationSeen}` } }
    );
    if (createNew && updateUserNotification) {
      return res.json({
        success: "Success",
      });
    }
  }

  if (email && For == "ForContractProfitWithdraw") {
    const createNew = await NotificationModel.create({
      email,
      For: For,
      message: NotificationList.getProfitMessage,
      header: NotificationList.getProfitHeader,
      timestamp: timestamp,
    });

    const user = await User.findOne({ email });
    const updateUserNotification = await User.updateOne(
      { email: email },
      { $set: { NotificationSeen: `${1 + user.NotificationSeen}` } }
    );
    if (createNew && updateUserNotification) {
      return res.json({
        success: "Success",
      });
    }
  }

  if (email && For == "IDverification") {
    const createNew = await NotificationModel.create({
      email,
      For: For,
      message: NotificationList.verificationMessage,
      header: NotificationList.verificationHeader,
      timestamp: timestamp,
    });

    const user = await User.findOne({ email });
    const updateUserNotification = await User.updateOne(
      { email: email },
      { $set: { NotificationSeen: `${1 + user.NotificationSeen}` } }
    );
    if (createNew && updateUserNotification) {
      return res.json({
        success: "Success",
      });
    }
  }

  if (email && For == "ForcontractOneReActivation") {
    const createNew = await NotificationModel.create({
      email,
      For: For,
      message: NotificationList.reActivationMessage,
      header: NotificationList.reActivationHeader,
      timestamp: timestamp,
    });

    const user = await User.findOne({ email });
    const updateUserNotification = await User.updateOne(
      { email: email },
      { $set: { NotificationSeen: `${1 + user.NotificationSeen}` } }
    );
    if (createNew && updateUserNotification) {
      return res.json({
        success: "Success",
      });
    }
  }

  if (email && For == "ForContractPauseAndWithdraw") {
    const createNew = await NotificationModel.create({
      email,
      For: For,
      message: NotificationList.pauseAndWithdrawMessage,
      header: NotificationList.pauseAndWithdrawHeader,
      timestamp: timestamp,
    });

    const user = await User.findOne({ email });
    const updateUserNotification = await User.updateOne(
      { email: email },
      { $set: { NotificationSeen: `${1 + user.NotificationSeen}` } }
    );
    if (createNew && updateUserNotification) {
      return res.json({
        success: "Success",
      });
    }
  }

  if (email && For == "sendSuccess") {
    const createNew = await notificationModel.create({
      email,
      For: For,
      message: NotificationList.sendMessage,
      header: NotificationList.sendHeader,
      timestamp: timestamp,
    });

    const user = await User.findOne({ email });
    const updateUserNotification = await User.updateOne(
      { email: email },
      { $set: { NotificationSeen: `${1 + user.NotificationSeen}` } }
    );
    if (createNew && updateUserNotification) {
      const { valueSend, amount } = req.body;

      const timestamp = new Date().getTime();
      const type = "Sent";
      const Status = "Success";
      const valueEth = valueSend;
      const valueUsd = amount;

      const CreateHistory = await history.create({
        email,
        type,
        Status,
        valueEth,
        valueUsd,
        timestamp,
      });
      if (CreateHistory) {
        return res.json({
          success: "Success",
        });
      }
    }
  } else {
    return res.json({
      error: "Error Creating Notification for Sending",
    });
  }
};

const tokenViews = async (req, res) => {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"
    );
    // const response = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/btc.min.json');
    if (!response.ok) {
      return res.json({
        error: "Network response was not ok",
      });
    }
    const data = await response.json();
    res.json({
      tokens: data,
    });
    // const tokenId = 'bitcoin'
    // const url = https://api.coingecko.com/api/v3/coins/${tokenId};
    // const response = await axios.get(url);
    // const data = response.data;

    // console.log(`Name: ${data.name}`);
    // console.log(`Symbol: ${data.symbol}`);
    // console.log(`Current Price (USD): $${data.market_data.current_price.usd}`);
    // console.log(`Market Cap (USD): $${data.market_data.market_cap.usd}`);
    // console.log(`24h Trading Volume (USD): $${data.market_data.total_volume.usd}`);
    // console.log(`Price Change 24h (%): ${data.market_data.price_change_percentage_24h}%`);
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};

/////////////////////////-----CONTRACT ONE SECTION-----///////////////////////////////
/////////////////////////------------------------------///////////////////////////////
/////////////////////////------------------------------///////////////////////////////
/////////////////////////------------------------------///////////////////////////////

const reActivateContractOne = async (req, res) => {
  try {
    const {
      to,
      from,
      email,
      name,
      gasFee,
      status,
      contractPrice,
      contractProfit,
      cumulativeGasUsed,
      blockNumber,
      blockHash,
      transactionHash,
      priceUsd,
    } = req.body;

    function setExpirationDate() {
      const currentDate = new Date();
      const expirationDate = new Date(currentDate);
      expirationDate.setDate(currentDate.getDate() + 2);
      return expirationDate;
    }

    const update = await UserContractOne.updateOne(
      { email: email },
      {
        $set: {
          to: `${to}`,
          from: `${from}`,
          name: `${name}`,
          gasFee: `${gasFee}`,
          status: `${status}`,
          contractPrice: `${contractPrice}`,
          contractProfit: `${contractProfit}`,
          cumulativeGasUsed: `${cumulativeGasUsed}`,
          blockNumber: `${blockNumber}`,
          blockHash: `${blockHash}`,
          transactionHash: `${transactionHash}`,
          tmp: new Date(),
          minWithrawalDate: setExpirationDate(),
        },
      }
    );

    const type = "Deposite";
    const Status = "Success";
    const valueEth = contractPrice;
    const valueUsd = priceUsd;
    const timestamp = new Date().getTime();

    const CreateHistory = await history.create({
      email,
      type,
      Status,
      valueEth,
      valueUsd,
      timestamp,
    });

    if (update && CreateHistory) {
      const admin = "bitclubcontract@gmail.com";
      const adminEmail = admin;
      const exist = await Admin.findOne({ adminEmail });
      if (exist) {
        function removePercent(value) {
          const percentageToRemove = exist.IncreasePercent;
          const amountToRemove = value * percentageToRemove;
          return amountToRemove;
        }
        const CP = removePercent(contractPrice);
        const ProfitAdd =
          CP / (await UserContractOne.find({ status: "Activated" })).length;
        const updateprofits = await UserContractOne.updateMany(
          { status: "Activated" },
          { $inc: { contractProfit: `${ProfitAdd}` } }
        );
        if (updateprofits) {
          await Admin.updateOne(
            { adminEmail: admin },
            { $inc: { totalContractProfit: ProfitAdd } }
          );
          return res.json({
            success: "contract created successfuly!",
            data: {
              contract: update,
            },
          });
        }
      } else {
        const createAdmin = await Admin.create({
          totalUser: 1,
          totalContractOne: 1,
          adminName: "Bitclub",
          adminEmail: "bitclubcontract@gmail.com",
          totalContractProfit: 0.5 * contractProfit,
          contractOnePrice: contractPrice,
          contractTwoPrice: 0,
          marketCap: 0,
          IncreasePercent: 0.15,
        });
        if (createAdmin) {
          return res.json({
            success: true,
          });
        }
      }
    }
    return {
      error: "Error re-activating ContractS",
    };
  } catch (error) {
    return res.json({
      error,
    });
  }
};

const contractOneTrxLogs = async (req, res) => {
  try {
    const {
      name,
      email,
      amount,
      to,
      from,
      blockNumber,
      transactionHash,
      status,
      blockHash,
      gasFee,
      contractProfit,
      contractPrice,
      priceEth,
    } = req.body;

    const createLogs = await PauseLogs.create({
      name,
      email,
      amount,
      to,
      from,
      blockNumber,
      transactionHash,
      status,
      blockHash,
      gasFee,
      contractProfit,
      contractPrice,
    });

    const type = "Withdrawn";
    const Status = "Success";
    const valueEth = priceEth;
    const valueUsd = amount;
    const timestamp = new Date().getTime();

    const CreateHistory = await history.create({
      email,
      type,
      Status,
      valueEth,
      valueUsd,
      timestamp,
    });
    if (createLogs && CreateHistory) {
      return res.json({
        success: "Transaction successfuly",
      });
    }
    console.log("Error");
  } catch (error) {
    return res.json({
      error: error,
    });
  }
};

const pauseContractOne = async (req, res) => {
  const { email } = req.body;
  const update = await UserContractOne.updateOne(
    { email: email },
    {
      $set: { status: `Paused`, contractPrice: `${0}`, contractProfit: `${0}` },
    }
  );
  if (update) {
    return res.json({
      success: "Contract paused Successfuly!",
    });
  }
  return res.json({
    error: "Error Pausing Contract",
  });
};

const contractOne = async (req, res) => {
  try {
    const {
      to,
      from,
      email,
      name,
      gasFee,
      status,
      contractPrice,
      contractProfit,
      cumulativeGasUsed,
      blockNumber,
      blockHash,
      transactionHash,
      priceUsd,
    } = req.body;

    const user_contract_check_one = await UserContractOne.findOne({ email });

    if (user_contract_check_one) {
      return res.json({
        activated: true,
        success: "Contract has been Activated Already!",
      });
    }

    if (!user_contract_check_one) {
      function setExpirationDate() {
        const currentDate = new Date();
        const expirationDate = new Date(currentDate);
        expirationDate.setDate(currentDate.getDate() + 2);
        return expirationDate;
      }
      const createContractOne = await UserContractOne.create({
        to,
        from,
        email,
        name,
        gasFee,
        status,
        contractPrice,
        contractProfit,
        cumulativeGasUsed,
        blockNumber,
        blockHash,
        transactionHash,
        priceUsd,
        tmp: new Date(),
        minWithrawalDate: setExpirationDate(),
      });

      const type = "Deposite";
      const Status = "Success";
      const valueEth = contractPrice;
      const valueUsd = priceUsd;
      const timestamp = new Date().getTime();

      const CreateHistory = await history.create({
        email,
        type,
        Status,
        valueEth,
        valueUsd,
        timestamp,
      });

      if (createContractOne && CreateHistory) {
        const admin = "bitclubcontract@gmail.com";
        const adminEmail = admin;
        const exist = await Admin.findOne({ adminEmail });
        if (exist) {
          const RemovePercent = await Admin.findOne({ adminEmail });
          function removePercent(value) {
            const percentageToRemove = RemovePercent.IncreasePercent;
            const amountToRemove = value * percentageToRemove;
            return amountToRemove;
          }
          const CP = removePercent(contractPrice);
          const ProfitAdd =
            CP / (await UserContractOne.find({ status: "Activated" })).length;
          const updateprofits = await UserContractOne.updateMany(
            { status: "Activated" },
            { $inc: { contractProfit: `${ProfitAdd}` } }
          );
          if (updateprofits) {
            await Admin.updateOne(
              { adminEmail },
              { $inc: { totalContractOne: 1, totalContractProfit: ProfitAdd } }
            );
            return res.json({
              success: "contract created successfuly!",
              data: {
                contract: createContractOne,
              },
            });
          }
        } else {
          const createAdmin = await Admin.create({
            totalUser: 1,
            totalContractOne: 1,
            adminName: "Bitclub",
            adminEmail: "bitclubcontract@gmail.com",
            totalContractProfit: 0,
            contractOnePrice: contractPrice,
            contractTwoPrice: 0,
            marketCap: 0,
            IncreasePercent: 0.15,
          });
          if (createAdmin) {
            return res.json({
              success: "contract created successfuly!",
            });
          }
        }
      }

      res.json({
        error: "Error creating Contract",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      error: "Error creating ContractOne",
    });
  }
};

const contractOneCheck = async (req, res) => {
  const { email } = req.body;
  const exist = await UserContractOne.findOne({ email });
  if (exist) {
    return res.json({
      status: true,
    });
  }
  return res.json({
    status: false,
  });
};

const getContractOne = async (req, res) => {
  const { email } = req.body;
  const exist = await UserContractOne.findOne({ email });
  if (exist) {
    return res.json({
      success: "Data Fetch Successfuly!",
      contractOne: exist,
    });
  }
  return res.json({
    message: false,
  });
};

const getProfitOne = async (req, res) => {
  const { email, amount } = req.body;
  const getUser = await UserContractOne.findOne({ email: email });
  const sub = getUser.contractProfit - amount;
  const uptProfit = await UserContractOne.updateOne(
    { email: email },
    { $set: { contractProfit: sub } }
  );
  if (uptProfit.acknowledged === true) {
    return res.json({
      success: true,
    });
  }
};

const Checker1 = async () => {
  //
};
Checker1();

/////////////////////////-----CONTRACT TWO SECTION-----///////////////////////////////
/////////////////////////------------------------------///////////////////////////////
/////////////////////////------------------------------///////////////////////////////
/////////////////////////------------------------------///////////////////////////////
const getProfitTwo = async (req, res) => {
  const { email, amount } = req.body;
  const getUser = await ContractTwo.findOne({ email: email });
  const sub = getUser.contractProfit - amount;
  const uptProfit = await ContractTwo.updateOne(
    { email: email },
    { $set: { contractProfit: sub } }
  );
  if (uptProfit.acknowledged === true) {
    return res.json({
      success: true,
    });
  }
};

const reActivateContractTwo = async (req, res) => {
  try {
    const {
      to,
      from,
      email,
      name,
      gasFee,
      status,
      contractPrice,
      contractProfit,
      cumulativeGasUsed,
      blockNumber,
      blockHash,
      transactionHash,
      priceUsd,
    } = req.body;

    function setExpirationDate() {
      const currentDate = new Date();
      const expirationDate = new Date(currentDate);
      expirationDate.setDate(currentDate.getDate() + 2);
      return expirationDate;
    }

    const update = await ContractTwo.updateOne(
      { email: email },
      {
        $set: {
          to: `${to}`,
          from: `${from}`,
          name: `${name}`,
          gasFee: `${gasFee}`,
          status: `${status}`,
          contractPrice: `${contractPrice}`,
          contractProfit: `${contractProfit}`,
          cumulativeGasUsed: `${cumulativeGasUsed}`,
          blockNumber: `${blockNumber}`,
          blockHash: `${blockHash}`,
          transactionHash: `${transactionHash}`,
          tmp: new Date(),
          minWithrawalDate: setExpirationDate(),
        },
      }
    );

    const type = "Deposite";
    const Status = "Success";
    const valueEth = contractPrice;
    const valueUsd = priceUsd;
    const timestamp = new Date().getTime();

    const CreateHistory = await history.create({
      email,
      type,
      Status,
      valueEth,
      valueUsd,
      timestamp,
    });

    if (update && CreateHistory) {
      const admin = "bitclubcontract@gmail.com";
      const adminEmail = admin;
      const exist = await Admin.findOne({ adminEmail });
      if (exist) {
        function removePercent(value) {
          const percentageToRemove = exist.IncreasePercent;
          const amountToRemove = value * percentageToRemove;
          return amountToRemove;
        }
        const CP = removePercent(contractPrice);
        const ProfitAdd =
          CP / (await ContractTwo.find({ status: "Activated" })).length;
        const updateprofits = await ContractTwo.updateMany(
          { status: "Activated" },
          { $inc: { contractProfit: `${ProfitAdd}` } }
        );
        if (updateprofits) {
          await Admin.updateOne(
            { adminEmail: admin },
            { $inc: { totalContractProfit: ProfitAdd } }
          );
          return res.json({
            success: "contract created successfuly!",
            data: {
              contract: update,
            },
          });
        }
      } else {
        const createAdmin = await Admin.create({
          totalUser: 1,
          totalContractOne: 0,
          totalContractTwo: 1,
          adminName: "Bitclub",
          adminEmail: "bitclubcontract@gmail.com",
          totalContractProfit: 0.5 * contractProfit,
          contractOnePrice: 0,
          contractTwoPrice: contractPrice,
          marketCap: 0,
          IncreasePercent: 0.15,
        });
        if (createAdmin) {
          return res.json({
            success: true,
          });
        }
      }
    }
    return {
      error: "Error re-activating ContractS",
    };
  } catch (error) {
    return res.json({
      error,
    });
  }
};

const contractTwoTrxLogs = async (req, res) => {
  try {
    const {
      name,
      email,
      amount,
      to,
      from,
      blockNumber,
      transactionHash,
      status,
      blockHash,
      gasFee,
      contractProfit,
      contractPrice,
      priceEth,
    } = req.body;

    const createLogs = await PauseLogs.create({
      name,
      email,
      amount,
      to,
      from,
      blockNumber,
      transactionHash,
      status,
      blockHash,
      gasFee,
      contractProfit,
      contractPrice,
    });

    const type = "Withdrawn";
    const Status = "Success";
    const valueEth = priceEth;
    const valueUsd = amount;
    const timestamp = new Date().getTime();

    const CreateHistory = await history.create({
      email,
      type,
      Status,
      valueEth,
      valueUsd,
      timestamp,
    });
    if (createLogs && CreateHistory) {
      return res.json({
        success: "Transaction successfuly",
      });
    }
    console.log("Error");
  } catch (error) {
    return res.json({
      error: error,
    });
  }
};

const pauseContractTwo = async (req, res) => {
  const { email } = req.body;
  const update = await ContractTwo.updateOne(
    { email: email },
    {
      $set: { status: `Paused`, contractPrice: `${0}`, contractProfit: `${0}` },
    }
  );
  if (update) {
    return res.json({
      success: "Contract paused Successfuly!",
    });
  }
  return res.json({
    error: "Error Pausing Contract",
  });
};

const contractTwo = async (req, res) => {
  try {
    const {
      to,
      from,
      email,
      name,
      gasFee,
      status,
      contractPrice,
      contractProfit,
      cumulativeGasUsed,
      blockNumber,
      blockHash,
      transactionHash,
      priceUsd,
    } = req.body;

    const user_contract_check_one = await ContractTwo.findOne({ email });

    if (user_contract_check_one) {
      return res.json({
        activated: true,
        success: "Contract has been Activated Already!",
      });
    }

    if (!user_contract_check_one) {
      function setExpirationDate() {
        const currentDate = new Date();
        const expirationDate = new Date(currentDate);
        expirationDate.setDate(currentDate.getDate() + 2);
        return expirationDate;
      }
      const createContractOne = await ContractTwo.create({
        to,
        from,
        email,
        name,
        gasFee,
        status,
        contractPrice,
        contractProfit,
        cumulativeGasUsed,
        blockNumber,
        blockHash,
        transactionHash,
        priceUsd,
        tmp: new Date(),
        minWithrawalDate: setExpirationDate(),
      });

      const type = "Deposite";
      const Status = "Success";
      const valueEth = contractPrice;
      const valueUsd = priceUsd;
      const timestamp = new Date().getTime();

      const CreateHistory = await history.create({
        email,
        type,
        Status,
        valueEth,
        valueUsd,
        timestamp,
      });

      if (createContractOne && CreateHistory) {
        const admin = "bitclubcontract@gmail.com";
        const adminEmail = admin;
        const exist = await Admin.findOne({ adminEmail });
        if (exist) {
          const RemovePercent = await Admin.findOne({ adminEmail });
          function removePercent(value) {
            const percentageToRemove = RemovePercent.IncreasePercent;
            const amountToRemove = value * percentageToRemove;
            return amountToRemove;
          }
          const CP = removePercent(contractPrice);
          const ProfitAdd =
            CP / (await ContractTwo.find({ status: "Activated" })).length;
          const updateprofits = await ContractTwo.updateMany(
            { status: "Activated" },
            { $inc: { contractProfit: `${ProfitAdd}` } }
          );
          if (updateprofits) {
            await Admin.updateOne(
              { adminEmail },
              { $inc: { totalContractTwo: 1, totalContractProfit: ProfitAdd } }
            );
            return res.json({
              success: "contract created successfuly!",
              data: {
                contract: createContractOne,
              },
            });
          }
        } else {
          const createAdmin = await Admin.create({
            totalUser: 1,
            totalContractOne: 0,
            totalContractTwo: 1,
            adminName: "Bitclub",
            adminEmail: "bitclubcontract@gmail.com",
            totalContractProfit: 0,
            contractOnePrice: 0,
            contractTwoPrice: contractPrice,
            marketCap: 0,
            IncreasePercent: 0.15,
          });
          if (createAdmin) {
            return res.json({
              success: "contract created successfuly!",
            });
          }
        }
      }

      res.json({
        error: "Error creating Contract",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      error: "Error creating ContractOne",
    });
  }
};

const contractTwoCheck = async (req, res) => {
  const { email } = req.body;
  const exist = await ContractTwo.findOne({ email });
  if (exist) {
    return res.json({
      status: true,
    });
  }
  return res.json({
    status: false,
  });
};

const getContractTwo = async (req, res) => {
  const { email } = req.body;
  const exist = await ContractTwo.findOne({ email });
  if (exist) {
    return res.json({
      success: "Data Fetch Successfuly!",
      contractOne: exist,
    });
  }
  return res.json({
    message: false,
  });
};

const tester = async (req, res) => {
  return res.status(200).json({
    message: "Access Tester Succesfully!",
  });
};

module.exports = {
  userInfo,
  pinCheck,
  loginUser,
  createPin,
  citizenId,
  pinVerify,
  tester,
  BNBWalletAuth,
  getProfitOne,
  getProfitTwo,
  tokenViews,
  googleLogin,
  registerUser,
  getProfile,
  getHistory,
  contractOne,
  contractTwo,
  BtcWalletAuth,
  Erc20WalletAuth,
  updateUserName,
  changePassword,
  getContractOne,
  getContractTwo,
  getNotification,
  pauseContractOne,
  pauseContractTwo,
  createNotification,
  contractOneCheck,
  contractTwoCheck,
  contractOneTrxLogs,
  contractTwoTrxLogs,
  reActivateContractOne,
  reActivateContractTwo,
};
