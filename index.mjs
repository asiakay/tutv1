<<<<<<< HEAD
import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';

(async () => {
  const stdlib = await loadStdlib();
  const startingBalance = stdlib.parseCurrency(10);
  const accAlice = await stdlib.newTestAccount(startingBalance);
  const accBob = await stdlib.newTestAccount(startingBalance);

  const fmt = (x) => stdlib.formatCurrency(x, 4);
  const getBalance = async (who) => fmt(await stdlib.balanceOf(who));
  const beforeAlice = await getBalance(accAlice);
  const beforeBob = await getBalance(accBob);

  const ctcAlice = accAlice.deploy(backend);
  const ctcBob = accBob.attach(backend, ctcAlice.getInfo());

  const HAND = ['Rock', 'Paper', 'Scissors'];
  const OUTCOME = ['Bob wins', 'Draw', 'Alice wins'];
  const Player = (Who) => ({
    ...stdlib.hasRandom, 
    getHand: async () => {
      const hand = Math.floor(Math.random() * 3);
      console.log(`${Who} played ${HAND[hand]}`);
      if ( Math.random() <= 0.01 ) { // moves accept wager timeout code into method, makes so timeouts happen 1% of the time
        for ( let i = 0; i < 10; i++ ) {
          console.log(`  ${Who} takes their sweet time sending it back...`);
          await stdlib.wait(1);
        }
      }
      return hand;
    },
    seeOutcome: (outcome) => {
      console.log(`${Who} saw outcome ${OUTCOME[outcome]}`);
    },
    informTimeout: () => {
      console.log(`${Who} observed a timeout`);
    },
  });

  await Promise.all([
    backend.Alice(ctcAlice, {
      ...Player('Alice'),
      wager: stdlib.parseCurrency(5),
    }),
    backend.Bob(ctcBob, {
      ...Player('Bob'),
      acceptWager: (amt) => { // redefining Bob's accetpWager method as an async function 
          console.log(`Bob accepts the wager of ${fmt(amt)}.`);
        },
    }),
  ]);

  const afterAlice = await getBalance(accAlice);
  const afterBob = await getBalance(accBob);

  console.log(`Alice went from ${beforeAlice} to ${afterAlice}.`);
  console.log(`Bob went from ${beforeBob} to ${afterBob}.`);

})();
=======
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
>>>>>>> 8775599839d02d82028646157bd205b0c1c9d23c
