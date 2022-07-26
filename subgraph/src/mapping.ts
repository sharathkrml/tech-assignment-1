import { Deposit, Withdraw } from "../generated/Treasury/Treasury";
import { ERC20 } from "../generated//Treasury/ERC20";
import { Token, TokenDeposit, User } from "../generated/schema";
import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";

export function handleDeposit(event: Deposit): void {
  let id = event.params.sender.toHex();
  let user = User.load(id);
  if (user == null) {
    user = new User(id);
  }
  user.save();
}
