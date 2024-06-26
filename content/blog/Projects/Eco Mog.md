---
title: Eco MOG
tags:
  - project
  - mog
publish: true
---
# Description
My aim is to build a multiplayer online game with an ecosystem that persists and evolves with or without player interaction.

### Properties
#### 1) **Multiplayer**
The plan is to create a series of "worlds" where many players are each given a body to occupy space in the world. Their ability to interact with each other and world will start small, and extend as the project continues.

![[town.jpeg]]
#### 2) Open World
The format of the "worlds" are more or less continuous spaces. The space within them is broken up by natural geographic features as well as flora and fauna which have various physical properties that allow *them* to interact with the *player*  , like a rock or tree not allowing movement, or a beastie gnoshing on the player.
![[desert_shmoops.jpeg]]
#### 3) Ecosystem Simulation
I touched on it above, but I am o drawn to the agency of a world itself, particular the capacity for emergent behavior, which is essentially the part of life that is the most magical. Here is a pattern that creates patterns, and cannot be predicted. I believe that my encoding some of the behavior and properties of the game organisms into a genetic-like object that mutates and is subject to reproductive and survival-driven species selection, I may be able to emulate some of that magic.

![[elements_rts.jpeg]]

#### 4) Chemical Abstraction
So here's the thing about ecosystems - they have to be based on immutable rules. The real world is. Otherwise, one creature could just have like 1000K strength and eat us all. Or maybe, since that creature would starve after killing everything else, a better example would be that a creature could just have a lifespan of infinity, if there were no limitations to that capability, negating any *necessity* for ecosystems/species selection/evolution to exist. So I need that to. Some sort of bedrock of immutable laws. I basically envision these tropic layers that all stem from some inherent energy that comes from occupying space (photosynthesis, but an abstraction) and minerals in the ground.

#### 4) Persistence and Time
The most obvious lifespan of a game seems to be, historically, for it to begin when players join and end when players leave. This provides a tempting opportunity to create a game that begins far before any player joins, and continues regardless of whether anyone is around. This is what makes the real world so mysterious and wonderful.


#### 5) POV
This is the least important property but still something that interests me. RTS games are generally third person views from above, and then there is the common first person perspective in games. I would like to provide he ability to switch between them. This is possible in the live demo posted above. I'm interested in interacting with the ecosystem both as an individual *and* a collective of individuals.
![[pov.png]]

### Previous Projects
Here is a screenshot from an ecosystem simulator I created in unity. You can see bunnies with lifespan and reproductive timer bars floating above their heads, scanning their surroundings for grass and eating it. I got granular with their sensory perception in the hopes it would create interesting and organic behavior, and I think I achieved a bit of the latter, if not the former.
![[grass2.jpeg]]
I haven't yet deployed the version above, but you [can play with the barebones of this environment in a live demo here](https://simmer.io/@Kua/grassworldv1)

### Theme of Environmentalism and Ecological Sustainability
this is pretty loose. I don't know if I believe that games can mitigate the effect human beings are having on this planet, and of mass extinction and destruction of natural habitats of once beautifully complex ecosystems. If anything, it is a celebration of them. I think there is a dark beauty in seeing how fragile they are and in allowing the players in this game to destroy and alter these systems, if they choose.

### Inspiration

- **RTS games** like Age of Empires, Age of Mythology and Black and White made a big impression on me. Their third-person dynamic allowed you to explore a world in a much bigger way, and see economies, like ecosystems, unfold as patterns.
![[bnw2.jpeg]]

- **Spore** is an incredibly ambitious game that, although imperfect, was really many games in one, and I think gave everyone a license to question what CAN'T be explored within the scope of a single game.

![[spore4.jpeg]]
> Single cell organism stage of spore
![[spore5.png]]
> Galactic view in spore
![[spore6.jpeg]]
> World civilization stage in spore

- Definitely Conway's Game of Life and Cellular Automata as a whole, not to mention John van Neumann's question of whether a system can create itself, all of which together are really for a whole other blog post.
### Wild Implementation Ideas
**Leveraging Distributed Databases**: 
Maintaining an ecosystem on a server is computationally expensive, and could be hard to scale horizontally if more and more users are interacting with the same world and the world is becoming more and more complex. Distributed databases might offer some interesting and creative solutions to this challenge, if the game is every computationally expensive enough for this to be necessary.

---
# May 24th: Getting Started

I started with a basic socket.io implementation on the server and the client.socket.io on both the server and the client. At first I found the structure of their documentation slightly confusing, but figuring out how it was broken down between client and server docs:

**Server**
- [Installation](https://socket.io/docs/v4/server-installation/)
- [Initialization](https://socket.io/docs/v4/server-initialization/) 
- [Complete Server API](https://socket.io/docs/v4/server-api/#socket)

**Client**
- [Socket instance](https://socket.io/docs/v4/client-socket-instance/) 
- [Complete Client API](https://socket.io/docs/v4/client-api/#socket)

The client code could look something like this:
```js
import { io } from "socket.io-client";

const  socket = io("ws://localhost:3000")
socket.on("connect", () => {
  console.log("Connected")
  console.log(socket.emit("player joined", determinePlayerId()))
});

socket.on("disconnect", (reason, details) => {
  console.log("The server disconnect", reason, details)
});
```

With a server like this:
```js
// Minimal Server
const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("Connected")
  socket.on("player joined", (playerId) => {
	  // do something when connection begins

    socket.on("disconnecting", async(reason) => {
	    // do something when connection ends
    })
  })
});

httpServer.listen(3000);
```

[Here is a commit that's roughly this stage of code for a really minimal socket.io server/client handshake](https://github.com/Elijer/ecomog/tree/814222651737e78b3e8f8a66e52ef38807b5f1bd)

I also tried playing around with just the base [websocket library that's shipped with all browsers](https://github.com/Elijer/ecomog/tree/websocket)but I found that socket.io had some really useful features I did not think I would do a better job implementing myself.

On top of this super basic structure, I created a grid of a bunch of divs and gave a player a location that was generated when they visited the url. By opening multiple browsers, I simulated what this could look like if multiple players joined.
![[mog1.png]]

Content that I had the beginnings of a multiplayer system, I moved onto the ecosystem. Here are some "plants"!
![[mog3-moss.png]]

Each of these is sent as a class instance every second.
![[mog4-moss.png]]

I gave each object some "reproductive" behavior, which actually looked more like movement.
<img src="https://thornberry-garden.s3.us-east-2.amazonaws.com/simple_repro_loop_moss.gif" gif loop=true>

It seemed like each moss should have multiple children, so I messed around with the generation size and got this.

<img src="https://thornberry-garden.s3.us-east-2.amazonaws.com/moss-looping.gif" gif loop=true>

---
# May 26th: Optimization
Things started crashing. Originally, I passed every object to the client, which was a bit silly. I refactored in a few ways
- Only pass the color per square
- only re-render divs that need to change
- Added an accompanying object with references to each object in their location *in addition* to the double-nested array/grid structure, which allowed for much cheaper iterations through organisms*
- Creating a set of class inheritance to describe organisms, like BaseTile > Organism > Moss

> I couldn't do away with the double-nested array/grid data structure though, because it was the best way to ask things like "what is next to this square?", as in "can I move here?"

Ideas for feature refactors
- only send the data for the *diff* of the board, since much of it is empty (at least at the "beginning" of a "game") - Courtesy of the wonderful [Wolf Mermelstein](https://404wolf.com/)
- Create a way to send a raw buffer of data, minimizing representations of color even further. I could decide to work with just 16 colors, for example, allowing me represent two squares with just a byte.
- Use a memory-safe language (bit of a knee-jerk with understanding what memory limitations I may be facing first, if any)

During this refactor, I learned something very important about declaring arrays. I wrote this line to create the empty grid like this:
```js
initializeGrid(){

// this.cols and this.rows is just the number of rows and columns.
return new Array(this.rows)
	.fill(new Array(this.cols)
	.fill(new Array(2)
	.fill(0)))
}
```
What I intended to do was to create an array (rows) of arrays (columns) or arrays (multiple slots per square).

But when I added a player to one of the squares like this:
```js
this.grid[x][y][0] = {
	id: playerId,
	position: [x, y],
	color: generateRandomColor(),
	online: true
}
```

This is what I got:
![[incorrect_array.png]]
Not really desired behavior. 

The problem was that the .fill method was simply filling each index with the same array, at every level of this set of nested loops!

It's chunkier, but this was the solution:
```js
initializeGrid() {
	const grid = [];
	for (let i = 0; i < this.rows; i++) {
		const row = [];
		for (let j = 0; j < this.cols; j++) {
			row.push([0, 0]); // Create a new array for each cell
		}
		grid.push(row);

	}

	return grid;

	}
```

Maybe I can get the podcast [99% invisible](https://99percentinvisible.org/) to sponsor this project.
![[correct_array.png]]

---
# May 28: Organism Behavior
Oof. I was disappointed to find that when I refactored the moss into a class inheritance system, the behavior didn't hit the same, so I ended up playing around a lot with it. It also DEFINITELY was still crashing, probably because the cycles of reproduction per generation were so dramatically in sync.

<div class="video-container"> <video controls> <source src="https://thornberry-garden.s3.us-east-2.amazonaws.com/Moss1.mp4" type="video/mp4"> Your browser does not support the video tag. </video> </div>

<div class="video-container"> <video controls> <source src="https://thornberry-garden.s3.us-east-2.amazonaws.com/Moss2.mp4" type="video/mp4"> Your browser does not support the video tag. </video> </div>

![[Screenshot 2024-05-28 at 5.04.25 PM.png]]

![[(https://youtu.be/lJ9mSX4Tbs8)

![[Screenshot 2024-05-27 at 10.50.52 PM.png]]

Still faced with a lot of latency, I talked with my peers and found that there are many ways I could tackle my latency challenges:
- Leverage the GPU for better performance
- Use WebGL for more efficient rendering than the DOM can provide
- Use Web Assembly for more efficient CPU usage than the browser can provide
- How a machine language like Rust or Go might really help with performance because garbage collection (cleaning up references to now unused items) might be very important
- Big 0 notation and understanding how different iterative structures really effect performance

I also discovered which organism properties had the most interesting conway-ish effects.
- The reproductive window of maturity moss could reproduce within
- The ability for moss to reproduce "OVER" neighboring moss
- Number of times a moss reproduced per generation

All this said, the most rational thing to do seemed to be to open up the Node profiler for the first time. Hello Node profiler!

![[Screenshot 2024-05-28 at 12.30.19 AM.png]]

It wasn't the biggest revelation, but the draw calls were certainly surpassing the amount of time allotting to the frames they were called in. So the easiest way to kill latency would probably be to just simply slow down the reproductive behavior, or make it slightly more diffuse over time (less synchronized). Luckily, these happen to be things that really make sense for plants anyways. I hope to return to many of these optimization opportunities above, but they also each have the ability to kill the project by making it into an optimization project instead of a game.

# May 29 - 31st: Graphics and Game Talks
I have been recommended this concept/article:
[How to make a simple entity-component-system in C++](https://www.david-colson.com/2020/02/09/making-a-simple-ecs.html)

And reminded of the brilliant Sebastian Lague, a youtube artist/gamecreater/programmer who creates [videos about stuff like volumetric cloud generation.](https://www.youtube.com/watch?v=DxfEbulyFcY)

I paired with [Seamus Edson](https://www.seamusedson.net/)today and discovered he's one of the best possible peers I could have when working on a project like this. I told him about wanting to use Three.JS for this project at some point, and he gave me some nuanced advice. On the one hand, he showed me a game he created with a colleague called [Lost Lots](https://rustforms.itch.io/lostlots) which sort of made me feel like, I don't even need to do this project because he did such an incredible job on something so similar. He created an incredible abstract chemistry system governing the laws of his plants.

But he also counseled me that, I didn't need to go 3D. Much of my concept really doesn't require 3D, and would actually be slowed down by the complexity 3D would introduce.

[Peter Stefek ](https://www.linkedin.com/in/peter-stefek-083a60126/) mentioned [this site in which each cell on the grid has behavior determined by a neural network.](https://distill.pub/2020/growing-ca/)which was interesting, but probably not relevant since the thing most like a neural net in my game will really by the generations organisms themselves. However, it opened up a cool conversation. Carsten wondered if a neural net thing could be use for tuning the model itself, sort of similar to how Yannick used combat simulations in his game to determine the difficulty of an enemy. He also pointed out that a point and click movement system is much less demanding than a square-by-square "WASD"-style input system.

> Note: Peter rewrote an implementation of the Game of Life on ShaderToy that I would really like see.

Reed framed this type of decision as a rung on a ladder of abstraction. This is a ladder of abstraction because the spectrum we're talking about is the spectrum of intent - what is the person intending to to, and you can go one step further on spectrum where you just declare the intent of the actor
He also pointed out I should probably figure out what kind of player interaction I am going for:
- Human interaction time
- How does a player choose what action to take? Can they add nutrients, or take it away? How does it work? Do they need to select a menu item which takes a while?

> Carsten also asked - do you play as a "human", or as a plant? I love this question.

Carsten also asked, can a single square on the map contain multiple things? How does my data model describe space, and stuff in space? I have some reflections on this I wrote down in my journal I ended up writing down much later.

Yannick, meanwhile, is interested in player interaction with the evolution of other organisms; breeding. Maybe even training pets?

At some point somebody showed me this crazy cool game called [lichenia](https://www.molleindustria.org/lichenia/), a really beautiful grid-based game.

To conclude, here's a thematic idea - what if there are human beings and you play as animals to destroy their civilization? Misanthropic, but a neat turn table.

# May 31st Continued: Conversation with Alex Chen
Alex Chen has created a very performant multiplayer top-down shooter game between a bunch of colorful bubbles using a custom implementation of UDP.

Here are some articles he sent me:
[Creating a first person shooter with one million players](https://mas-bandwidth.com/creating-a-first-person-shooter-that-scales-to-millions-of-players/)
[Choosing the right network model for your multiplayer game](https://mas-bandwidth.com/choosing-the-right-network-model-for-your-multiplayer-game/)


# June 18: Rust
That past couple weeks have flown by. I spent much of one week [creating this during a gamejam](https://sedson.itch.io/form-of-danger) and a lot of the second week working on my [[Gauntlet]] , which started during Impossible Day (where Recurser's try to do something impossible) and quickly became something I wanted to continue working on throughout the week.

This week, I am working on deployment. [I did it actually! Here is the live Demo of what I have so far!](https://saskanupe-b0a033b8892a.herokuapp.com/) This was deployed with Heroku. I made it pretty far with dockerizing and deploying with the community disco server as well, but couldn't quite get it just yet.

**Rust and WASM**: I tried out Web Assembly and using it to compule Rust to the browser in the hope that at some point I can port much of this game to rust.

One really reassuring part of the Rust community (besides all of it) is that [one of the most popular "Hello World"'s is actually an implementation of Conway's game of life!](https://rustwasm.github.io/book/game-of-life/introduction.html)

----

# June 19th: Part II
Okay, I've deployed *something*, so I feel more comfortable walking through the project and trying to improve it a bit in its current state.

```
// Directory system
- server <--- Node.js server
- client <--- vite client bundle
- package.json
```

And here's how to deploy to Heroku since I didn't document that the first time around:
```json
"scripts": {
	"start": "npm run build-client && npm run server",
	"build-client": "cd client && npm i && npm run build",
	"server": "cd server && npm i && node server.js"
},
// Note there are also package.json files in server and client directories
```

At this point I should probably be using docker, but this Heroku process works and I want to keep moving.

I actually have omitted the `Procfile` Heroku sometimes wants because without it, Heroku defaults to a `web` process running `npm run start`, which is exactly what I want to do.

[Here is a snapshot if the repo at this stage.](https://github.com/Elijer/jungle/commit/75c07f89e653ceebd826823f570107b57d5516af)

**Here are two guides I used to deploy with Heroku**
- [Deploying to Heroku from git](https://devcenter.heroku.com/articles/git)
- [Here is a guide on deploying a Node app to Heroku](https://devcenter.heroku.com/articles/deploying-nodejs)

> **One gotcha I faced:** Setting your node version in you package.json is very important, and making sure it lines up with version you're using locally and remotely.

