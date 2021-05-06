import { loadStdlib } from '@reach-sh/stdlib'; // imports Reach standard library loader
import * as backend from './build/index.main.mjs'; // imports backend to be compiled by ./reach

(async () => { // asynchronous function & body of our frontend
  const stdlib = await loadStdlib(); // loads the standard library dynamically based on the REACH_CONNECTOR_MODE
  const startingBalance = stdlib.parseCurrency(10); // defines a quantity of network tokens as the starting balance for each test account.

  const accAlice = await stdlib.newTestAccount(startingBalance); // test accounts with initial endowments for Alice and Bob.
  const accBob = await stdlib.newTestAccount(startingBalance);

  const ctcAlice = accAlice.deploy(backend); //  Alice deploys the application
  const ctcBob = accBob.attach(backend, ctcAlice.getInfo()); // Bob attaches to it

  const HAND = ['Rock', 'Paper', 'Scissors']; // array to hold the meaning of the hands
  const OUTCOME = ['Bob wins', 'Draw', 'Alice wins']; // arrays to hold the outcomes
  const Player = (Who) => ({ // constructor for the Player implementation
    getHand: () => { // defines the getHand method
      const hand = Math.floor(Math.random() * 3);
      console.log(`${Who} played ${HAND[hand]}`);
      return hand;
    },
    seeOutcome: (outcome) => { // defines the seeOutcome method
      console.log(`${Who} saw outcome ${OUTCOME[outcome]}`);
    },
  });

  await Promise.all([ // waits for the backends to complete
    backend.Alice(
      ctcAlice,
      {},
    ), // initializes Alice’s backend
    backend.Bob(
      ctcBob,
      {},
    ), // initializes Bob’s backend
  ]);
})(); // <-- Don't forget these! They call this asynchronous function that we’ve defined