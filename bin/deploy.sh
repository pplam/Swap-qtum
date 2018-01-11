rm -rf abis && mkdir abis
cd contracts/

ATN=`solar deploy atn-contracts/ATN.sol \
  | grep '=>' \
  | awk -F'=>' '{print $2}' \
  | tr -d ' '`
mv solar.development.json ../abis/ATN.json
echo $ATN

CHAIN_ID=0x000000000000000000000000000000000000000000000000000000007174756d
N=1

solar deploy Swap.sol "[\"${CHAIN_ID}\",\"${ATN}\",${N}]"
mv solar.development.json ../abis/SWAP.json

solar deploy Authority.sol
mv solar.development.json ../abis/AUTHORITY.json
