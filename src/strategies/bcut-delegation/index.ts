// /* eslint-disable prettier/prettier */
// import { getAddress } from '@ethersproject/address';
// import { BigNumberish } from '@ethersproject/bignumber';
// import { formatUnits } from '@ethersproject/units';
// import { Multicaller } from '../../utils';

// export const author = 'flaflafla';
// export const version = '0.1.1';

// // contracts available on Ethereum mainnet and Goerli testnet
// const kidsAddressByNetwork = {
//   137: '0xa5ae87B40076745895BB7387011ca8DE5fde37E0',
// };

// const abi = [
//   // Kids and Puppies contracts
//   'function getTotalDelegation(address _delegator) external view returns(uint256)'
// ];

// export async function strategy(
//   _space,
//   network,
//   provider,
//   addresses,
//   _options,
//   snapshot
// ): Promise<Record<string, number>> {
//   const blockTag = typeof snapshot === 'number' ? snapshot : 'latest';

//   const multi = new Multicaller(network, provider, abi, { blockTag });

//   addresses.forEach((address) => {
//     // get Kids balance
//     multi.call(`${address}.delegation`, kidsAddressByNetwork[network], 'getTotalDelegation', [
//       address
//     ]);
//   });

//   const result: Record<string, { delegation: BigNumberish }> = await multi.execute();
//   console.log("Result:", result);

//   return Object.fromEntries(
//     Object.entries(result).map(([address, { delegation }]) => {
//       // calculate total voting power
//       const votingPower = parseFloat(formatUnits(delegation, 18)) * 1;

//       return [getAddress(address), votingPower];
//     })
//   );
// }

import { BigNumberish } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';
import { Multicaller } from '../../utils';

export const author = 'bonustrack';
export const version = '0.1.1';

const abi = [
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
  addresses.forEach((address) =>
    multi.call(address, options.address, 'getTotalDelegation', [address])
  );
  const result: Record<string, BigNumberish> = await multi.execute();

  return Object.fromEntries(
    Object.entries(result).map(([address, balance]) => [
      address,
      parseFloat(formatUnits(balance, options.decimals))
    ])
  );
}
