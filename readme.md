# Tonspay webapp

This repo is about the telegram-webapp system of Tonspay . 

## How it works :

A H5 base font-end system , with flexable action & request management , likly handel DOM directly (Which is not a good idea , but it just work)

Base on :

- Web3.js

- SOLANWEB3.js

- TONCONNECT.js

## Basic logic :

- #### Index page

  - Wallet connect card
  - 4 Basic functions
    - Send
    - Recive
    - Cash gift
    - Invoices
  - Sending asserts
    - TON
    - SOL
    - ETH
    - BTC
  - Recent invoices
  - Header
  - Footer
  - Menu

- #### Wallet page

  - Wallet connect card
  - Setting

- #### Payment page

  - New invoices
  - Cash gift
  - Account check

- #### Invoices page

  - List all invoiced
  - New invoiced form
  - Single invoices payment

- #### Payment page

  - Metamask payment confirm
  - Fantom payment confirm
  - Tons payment confirm

## How to run :

Copy all the thing into `nginx` path and set the proxy of api interface into api path .

### Others :

- All the code of font-end fork from [chinaz](https://sc.chinaz.com/)

