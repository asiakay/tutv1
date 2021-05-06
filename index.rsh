'reach 0.1'; 

const Player =  // participant interact interface shared between two players
    {
        getHand: Fun([], UInt), // method 1 returns a number
        seeOutcome: Fun([UInt], Null) }; // method 2 receives a number

export const main =
  Reach.App(
    {},
    [Participant('Alice', {}), Participant('Bob', {})], // interface for both participants
    (A, B) => {
      exit(); });


      /* interact in the rest of the program 
      will be bound to an object with methods 
      corresponding to these actions, 
      which will connect to the frontend 
      of the corresponding participant. */