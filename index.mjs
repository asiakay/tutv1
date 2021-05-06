import { loadStdlib } from '@reach-sh/stdlib'; // imports Reach standard library loader
import * as backend from './build/index.main.mjs'; // imports backend to be compiled by ./reach

(async () => { // asynchronous function & body of our frontend
  const stdlib = await loadStdlib(); // loads the standard library dynamically based on the REACH_CONNECTOR_MODE
  const startingBalance = stdlib.parseCurrency(10); // defines a quantity of network tokens as the starting balance for each test account.
  const accAlice = await stdlib.newTestAccount(startingBalance); // test accounts with initial endowments for Alice and Bob.
  const accBob = await stdlib.newTestAccount(startingBalance);

  const fmt = (x) => stdlib.formatCurrency(x, 4); // function for displaying currency amounts with up to 4 decimal places
  const getBalance = async (who) => fmt(await stdlib.balaceOf(who)); // function for getting the balance of a participant and displaying it with up to 4 decimal places
  const beforeAlice = await getBalance(accAlice); // get the balance before the game starts for both Alice 
  const beforeBob = await getBalance(accBob); // get the balance before the game starts for Bob

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
    backend.Alice( ctcAlice, {
      ...Player('Alice'),
      wager: stdlib.parseCurrency(5),
      }), // initializes & Instantiates Alice’s backend
    backend.Bob(ctcBob, {
      ...Player('Bob'),
      acceptWager: (amt) => { // defining the acceptWager function
        console.log(`Bob accepts the wager of ${fmt(amt)}.`);
      },
    }), // initializes & Instantiates Bob’s backend
  ]);

  const afterAlice = await getBalance(accAlice); // gets balance after
  const afterBob = await getBalance(accBob); // gets balance after

  console.log(`Alice went from ${beforeAlice} to ${afterAlice}.`); // prints to console
  console.log(`Bob went from ${beforeBob} to ${afterBob}.`); // prints to console


})(); // <-- Don't forget these! They call this asynchronous function that we’ve defined