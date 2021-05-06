'reach 0.1'; 
const Player =  // participant interact interface shared between two players
    {
        getHand: Fun([], UInt), // method 1 returns a number
        seeOutcome: Fun([UInt], Null) }; // method 2 receives a number

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