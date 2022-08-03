import {
  Deposit as DepositEvent,
  Withdraw as WithdrawEvent,
} from "../generated/Treasury/Treasury";
import { ERC20 } from "../generated//Treasury/ERC20";
import { Token, UserBalance, User } from "../generated/schema";
import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";
export function handleDeposit(event: DepositEvent): void {
  //event Deposit(address sender, address token, uint256 amount);
  let userId = event.params.sender;
  let user = User.load(userId);
  if (user == null) {
    user = new User(userId);
  }
  let tokenId = event.params.token;
  let token = Token.load(tokenId);
  if (token == null) {
    token = new Token(tokenId);
  }
  let tokenContract = ERC20.bind(event.params.token);
  token.decimals = BigInt.fromI32(tokenContract.decimals());
  token.symbol = tokenContract.symbol();
  token.name = tokenContract.name();

  let userBalanceId =
    event.params.sender.toHexString() + event.params.token.toHexString();
  let userBalance = UserBalance.load(userBalanceId);
  if (userBalance == null) {
    userBalance = new UserBalance(userBalanceId);
    userBalance.balance = event.params.amount;
  } else {
    userBalance.balance = userBalance.balance.plus(event.params.amount);
  }
  userBalance.user = user.id;
  userBalance.token = token.id;
  userBalance.save();
  token.save();
  user.save();
}
