import ethers from 'ethers'

export default function tokenBalance({ tokenAddress, minimumBalance, tokenName }) {
    let ethersProvider;
    let tokenContract;

    const abi = [
        // Read-Only Functions
        "function balanceOf(address owner) view returns (uint256)",
        "function decimals() view returns (uint8)",
        "function symbol() view returns (string)",

        // Authenticated Functions
        "function transfer(address to, uint amount) returns (boolean)",

        // Events
        "event Transfer(address indexed from, address indexed to, uint amount)"
    ];

    return async stateAndHelpers => {
        const {
            wallet: { provider },
            address,
            BigNumber
        } = stateAndHelpers;

        if (!tokenContract) {
            ethersProvider = new ethers.providers.Web3Provider(provider);
            tokenContract = new ethers.Contract(tokenAddress, abi, ethersProvider);
        }

        const tokenDecimals = await tokenContract.decimals();
        const divideBy = new BigNumber(10).pow(tokenDecimals);
        const tokenBalanceResult = await tokenContract
            .balanceOf(address)
            .then(res => res.toString());
        const tokenBalance = new BigNumber(tokenBalanceResult).div(divideBy);

        if (tokenBalance.lt(minimumBalance)) {
            return {
                heading: `Get Some ${tokenName}`,
                description: `You need to have at least ${minimumBalance} ${tokenName} to interact with this Dapp. Send some more ${tokenName} to this address or switch to another address that has a higher ${tokenName} balance.`,
                eventCode: "tokenBalance",
                icon: `
        	<svg 
        		height="18" 
        		viewBox="0 0 429 695" 
        		width="18" xmlns="http://www.w3.org/2000/svg"
        	>
        		<g 
        			fill="currentColor" 
        			fill-rule="evenodd"
            >
        		 <path d="m0 394 213 126.228516 214-126.228516-214 301z"/>
             <path d="m0 353.962264 213.5-353.962264 213.5 353.962264-213.5 126.037736z"/>
            </g>
           </svg>
        `
            };
        }
    };
}