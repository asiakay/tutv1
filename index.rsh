<<<<<<< HEAD
'reach 0.1';

const [ isHand, ROCK, PAPER, SCISSORS ] = makeEnum(3);
const [ isOutcome, B_WINS, DRAW, A_WINS ] = makeEnum(3);

const winner = (handA, handB) =>
      ((handA + (4 - handB)) % 3);

assert(winner(ROCK, PAPER) == B_WINS);
assert(winner(PAPER, ROCK) == A_WINS);
assert(winner(ROCK, ROCK) == DRAW);

forall(UInt, handA =>
  forall(UInt, handB =>
    assert(isOutcome(winner(handA, handB)))));

forall(UInt, (hand) =>
  assert(winner(hand, hand) == DRAW));

const Player =
      { ...hasRandom, // <--- new!
        getHand: Fun([], UInt),
        seeOutcome: Fun([UInt], Null),
        informTimeout: Fun([], Null) }; // informTimeout, that receives no arguments and returns no information
const Alice =
      { ...Player,
        wager: UInt };
const Bob =
      { ...Player,
        acceptWager: Fun([UInt], Null) };

const DEADLINE = 10; // defines the deadline as ten time delta units, https://docs.reach.sh/ref-model.html#%28tech._time._delta%29
export const main =
  Reach.App(
    {},
    [Participant('Alice', Alice), Participant('Bob', Bob)],
    (A, B) => {
      const informTimeout = () => { // defines the function as an arrow expression.
        each([A, B], () => { // has each of the participants perform a local step.
          interact.informTimeout(); }); }; // has them call the new informTimeout method.

      A.only(() => {
        const wager = declassify(interact.wager); });
      A.publish(wager) // Alice publishing and payingn wager
        .pay(wager);
      commit();
      B.only(() => {
        interact.acceptWager(wager); });
      B.pay(wager) // bob pays wager 
        .timeout(DEADLINE, () => closeTo(A, informTimeout)); // adds a timeout handler to Bob’s publication
      // no consensus step commit
      var outcome = DRAW; // defines the loop variable, outcome
      invariant(balance() == 2 * wager && isOutcome(outcome) ); // the body of the loop does not change the balance in the contract account and that outcome is a valid outcome
      while ( outcome == DRAW ) { // begins the loop with the condition that it continues as long as the outcome is a draw
        
        commit(); // commits the last transaction, which at the start of the loop is Bob’s acceptance of the wager, and at subsequent runs of the loop is Alice’s publication of her hand.
 
      A.only(() => {
          const _handA = interact.getHand();
          const [_commitA, _saltA] = makeCommitment(interact, _handA);
          const commitA = declassify(_commitA); });
      A.publish(commitA)
          .timeout(DEADLINE, () => closeTo(B, informTimeout));
        commit(); // almost identical to the older version, except the wager is already known and paid.
      
      unknowable(B, A(_handA, _saltA));
      B.only(() => {
        const handB = declassify(interact.getHand()); });
      B.publish(handB)
      .timeout(DEADLINE, () => closeTo(A, informTimeout));
      commit(); // Bob has already accepted and paid the wager prior to this step

      A.only(() => {
        const [saltA, handA] = declassify([_saltA, _handA]); });
      A.publish(saltA, handA)
        .timeout(DEADLINE, () => closeTo(B, informTimeout)); // adds a timeout handler to Alice's publication
      checkCommitment(commitA, saltA, handA); // almost an identical step as Bob's previous

      outcome = winner(handA, handB); // updates loop with new value
      continue; } // continues the loop , while doesn't run infinitely

     assert(outcome == A_WINS || outcome == B_WINS); // asserts that outcome is never draw
     transfer(2 * wager).to(outcome == A_WINS ? A : B); // transfers funds to winner
     commit();
     
      each([A, B], () => {
        interact.seeOutcome(outcome); });
      exit(); });
=======
'reach 0.1'; 
const Player =  // participant interact interface shared between two players
    {
        getHand: Fun([], UInt), // method 1 returns a number
        seeOutcome: Fun([UInt], Null) }; // method 2 receives a number
const Alice =  // defining Alice's interface as Player interface 
      { ...Player,
        wager: UInt }; // plus integer value called wager
const Bob = // // defining Bob's interface as Player interface 
      { ... Player,
        acceptWager: Fun([UInt], Null) }; // plus integer value called acceptWager

export const main =
  Reach.App(
    {},
    [Participant('Alice', Player), Participant('Bob', Player)], // interface for both participants
    (A, B) => {
      A.only(() => { // Only alice is bound to handA
        const handA = declassify(interact.getHand()); }); // declassifies and binds value to Alice through getHand method
      A.publish(handA); // tells Alice to join the app by publishing to the consensus network
      commit(); // commits the state to the consensus network
      
      B.only(() => { // matching Alice's local step
        const handB = declassify(interact.getHand()); });
      B.publish(handB); // through consensus transfer publication https://docs.reach.sh/ref-model.html#%28tech._consensus._transfer%29

      const outcome = (handA + (4 - handB)) % 3; // computes the outcome of the game before committing
      commit();
    
      each([A, B], () => { // https://docs.reach.sh/ref-programs-step.html#%28tech._each%29
        interact.seeOutcome(outcome); }); // https://docs.reach.sh/ref-programs-local.html#%28reach._%28%28interact%29%29%29

      exit(); });


      /* interact in the rest of the program 
      will be bound to an object with methods 
      corresponding to these actions, 
      which will connect to the frontend 
      of the corresponding participant. */
>>>>>>> 8775599839d02d82028646157bd205b0c1c9d23c
