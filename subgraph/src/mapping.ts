import { Deposit, Withdraw } from "../generated/Treasury/Treasury";
import { ERC20 } from "../generated//Treasury/ERC20";
import { Token, UserBalance, User } from "../generated/schema";
import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";

export function handleDeposit(event: Deposit): void {
  let id = event.params.sender.toHex();
  let user = User.load(id);
  if (user == null) {
    user = new User(id);
  }
  let balanceId = event.params.sender.toHex()+event.params.token.toHex()
  let balance = UserBalance.load(balanceId);
   if (balance == null) {
     balance = new UserBalance(balanceId);
   }
  balance.balance = balance.balance.plus(event.params.amount);
  balance.user = id
  let tokenId = event.params.token.toHex();
  let token = Token.load(tokenId)
  if (token == null) {
    token = new Token(tokenId);
  }


  user.save();
}
