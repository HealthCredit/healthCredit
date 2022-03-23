# Health Credit
#### "Like a carbon credit but for health."

## Overview
Healthcare funders like corporations, governments and foundations want to improve health in developing countries but funders are unsure of the impact they are getting. Health interventions that could save lives go underfunded due to lack of awareness, accessibility and traceable impact.

We’re all familiar with this: when we see a company’s annual report say “We are helping maternal health in Africa” we wonder “Are they? How much? And how sure are they?”

In the era of blockchains we need not be in doubt anymore.

## Solution
Just as carbon credits represent a ton of carbon or equivalent removed from the atmosphere, we can tokenize health using DALYs (disability adjusted life years) as a unit of account.

Each HealthCredit represents a DALY averted. Each verified company gets a unique token of impact with their logo/photo but also other relevant stats and other perks like annual investor calls or admission at social clubs for impact investors.[[1]](https://docs.google.com/document/d/1EqHl12o47FbkosROCIC6HkqtJEkZMksZZv0JayX1kCU/mobilebasic#ftnt1) Each accredited health organization can sell their tokens on a marketplace at the market price. The token uses the ticker symbol $LIFE-YEAR for “life year saved.”

Here are example organizations with example stats:

![](https://lh6.googleusercontent.com/AjROuUXO1LOzzjVvGreqt-BBD9MEOqPcnYRY2Aav1NxlL20yTU-K_IF1-QxLLOa2KmxvwtS3Vdxq3sbtlL-NtW2RpdZM0vRZLOinqfYrLAlPl1zDe-b9ChBbrSLqDIGLlwOxFkQ6)

Price of $LIFE-YEAR (the life-years saved token) depends on the subjective view of the buyer. For example, an $LIFE-YEAR from a health center in rural Kenya might be worth more to buyers than an $LIFE-YEAR from a hospital in New York. This is similar to how carbon credits work, though the carbon credit solution is less elegant. Carbon credits were intended to be fungible, but in practice buyers are willing to pay a higher price for a ton of carbon from saving the amazon rainforest than a ton of carbon from a cement plant that reduces emissions by 5%.

NFTs and crypto currency is a good way to solve the challenge of subjective value of a DALY while simultaneously referencing a concrete number. The picture on the token also maintains the emotional relationship to the project the DALY came from. Each health organization’s token will come with an image of the project so that people can keep it in their digital wallet, on their digital trophy wall or annual report. It will also link to a video of the work and may come with perks like visiting the project (for major patrons).

The number of $LIFE-YEAR for sale depends on how many DALYs an organization saves, which are subsequently verified.

## MVP for Hackathon

### Roles:

-   Investor: someone who buys $IMPACT ERC20 governance token such as a high net worth individual or institutional investor
    
-   Project Developer: a HealthCare Organization that generates the impact such as a chain of maternal health facilities in rural Uganda. They sell this impact by selling the ERC1155 token, $LIFE-YEAR
    
-   Credit Buyer: someone who buys the $LIFE-YEAR token
    
-   Beneficiary: the patients receiving the health treatment
    

### Interaction

- Investor buys $IMPACT token with $MATIC. They can hold it in their wallet, sell it on a DEX or stake it in the protocol.

- Project Developer applies to be verified by submitting documentation ( CSV of Beneficiaries and Impact records). Investors decide to vote on the submitted documentation.

- Project Developer sets the price of the $LIFE-YEAR credits they want to sell, which is minted and sent to their wallets. The Project Developer can then list the tokens on a marketplace.

- A Credit Buyer signs in with their wallet to the marketplace and purchases credits with $MATIC. The NFT $LIFE-YEAR are transferred to their wallet where they are non-transferable. 

## Architecture
### Web3.Storage and Filecoin
We use web3.storage to store (on filecoin) credentials uploaded by Project Developers which includes (CSV files of beneficiaries and impact records) as a folder.

### PostrgeSQL
CIDs (Content Identidiers) for each project folder upload is saved on PostrgeSQL database in order to fetch the credentials when needed (eg. For $Impact token holders to review before approving or denying a project)

### Polygon 
- The healthCredit contracts exist on Polygon Mumbai testnet which gives us the ability to run our application in a real world environment.

- Links to Project Folders stored on filecoin via Web3.storage are also saved on chain through the contract as a reference point for approvals.

### Contracts
HealthCredit consists of 2 contracts; an ERC20 contract and an ERC721 contract

#### ERC20 Token Contract
This is the contract of Impact tokens which are a key component of the approval process.

#### ERC721 Token Contract
This is the contract for the $LIFE-YEARS token (a.k. $LYS tokens), which are minted and project developers receive in their wallets, after their proposal/project has been approved. The $LYS tokens can be listed on a marketplace for sale.

### DApp
The frontend is built with ethers.js, and Next.js.

The backend is built with ethers.js, Nest.js and PostgreSQL

# Future Improvements

### IPFS
We could change the way we’re pinning  files to IPFS and uploading to Filecoin via web3.storage to prevent redundant and continuous uploads by project developers

### UI/UX
The general User interface and User experience would definitely need major upgrades and changes to be more appealing and satisfying to users.

### Postgres
The approach to fetching saved cids from the database would either be changed or a different database would be created for non-project developers

### User Accounts
Adding the option for users to choose between investor and project developer accounts would aid in properly separating groups of users to avoid conflicts of data, and facilitate cleaner data fetching from the database.