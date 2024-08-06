import { BigNumberish } from '@ethersproject/bignumber';
import { getAddress } from '@ethersproject/address';
import { formatUnits } from '@ethersproject/units';
import { Multicaller } from '../../utils';

export const author = 'bonustrack';
export const version = '0.1.1';
const operator = '0xdc244B6fC651Af077e64F1277Ba0b5159dE6383E';
const contributor = '0xDf9F850F0c27E5305Ad084B729dDC099A3D3640D';

const abi = [
  'function getStakerBalance(address _operator) external view returns(uint)',
  'function getTotalDelegation(address _delegator) external view returns(uint256)'
];

export async function strategy(
  space,
  network,
  provider,
  addresses,
  options,
  snapshot
): Promise<Record<string, number>> {
  const blockTag = typeof snapshot === 'number' ? snapshot : 'latest';

  const multi = new Multicaller(network, provider, abi, { blockTag });

  addresses.forEach((address) => {
    // get Kids balance
    multi.call(`${address}.operator`, operator, 'getStakerBalance', [address]);
    multi.call(`${address}.delegator`, operator, 'getTotalDelegation', [
      address
    ]);

    multi.call(`${address}.contributor`, contributor, 'getStakerBalance', [
      address
    ]);
  });

  const result: {
    address: {
      operator: BigNumberish;
      delegator: BigNumberish;
      contributor: BigNumberish;
    };
  } = await multi.execute();

  return Object.fromEntries(
    Object.entries(result).map(
      ([address, { operator, delegator, contributor }]) => {
        const operatorStaking = parseFloat(formatUnits(operator, 0));

        const delegatorStaking = parseFloat(formatUnits(delegator, 0));

        const contributorStaking = parseFloat(formatUnits(contributor, 0));

        // calculate total voting power
        const votingPower =
          operatorStaking + delegatorStaking + contributorStaking;

        return [getAddress(address), votingPower];
      }
    )
  );
}
