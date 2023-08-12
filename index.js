const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const corsOptions =  {
	origin: "http://localhost:3000",
	methods: [ "GET", "POST", "OPTIONS" ],
}
const io = require("socket.io")(server, {
	cors: corsOptions,
});

app.use(cors(corsOptions));

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.send('Running');
});


io.on("connection", (socket) => {
	io.emit("me", socket.id);

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	});
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
module.exports = app;