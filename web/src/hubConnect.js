// import * as signalR from "@microsoft/signalr";
// const { notify } = useNotification();

// const hubconnection = new signalR.HubConnectionBuilder()
//   .withUrl("https://localhost:7156/OddsHub")
//   .withAutomaticReconnect()
//   .build();

// await hubconnection.start();

// hubconnection.on("ReceiveOddsUpdate", (odds) => {
//   console.log("New odds received:", odds);
//   notify({
//     type: result.won ? 'win' : 'lost',
//     title: result.won ? '🏆 You Won!' : 'Better luck next time',
//     message: result.won
//       ? `${result.horse} won Race #${result.raceId}. You received ₹${result.payout}.`
//       : `${result.horse} finished ${result.position}th in Race #${result.raceId}.`
//   })
// });

// export default hubconnection;