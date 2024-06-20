---
publish: false
---
On the third week of my batch there was a mini-game jam.

I ended up joining a team of four other people and we created a "vibes-first walking game" that was loosely based on [long-term nuclear waste warning messages created in the early 80's to deter future civilizations from stumbling into dangerously radioactive sites whose hazards outlived out current civilization.

As a gamedev amateurm, I have used the game engine Unity to create [a couple](https://bidenbox.firebaseapp.com/) of [3D experiments](https://simmer.io/@Kua/grassworldv1) , but have really wanted to use something like [ThreeJS](https://threejs.org/) as a more DIY and less opinionated platform for game development. This game jam gave me a perfect opportunity!

---
### Gameplay
[You can play the game at Seamus's site here.](https://sedson.itch.io/form-of-danger
), and here is a video of how the gameplay ended up turning out


<div class="video-container"> <video controls> <source src="https://thornberry-garden.s3.us-east-2.amazonaws.com/danger_gameplay.mp4" type="video/mp4"> Your browser does not support the video tag. </video> </div>

# Process
Seamus volunteered a library he'd written that was a wrapper for WebGL but essentially with fewer lines of code needed than Three JS, and although he hadn't written any documentation about it, we were all pretty enthusiastic about trying it out.

Rylee started out by using noise to generate 3D meshes randomly for the basis of a game world.
![[Screenshot-e2024-06-03-at-6.54.13PM.png]]
![[Screenshot-2024-06-03-at-7.07.24PM.png]]
Here is an early test play:
<div class="video-container"> <video controls> <source src="https://thornberry-garden.s3.us-east-2.amazonaws.com/danger_russ.MOV" type="video/mp4"> Your browser does not support the video tag. </video> </div>

I had been thinking about how cool it would be to create a kayaking game of some kind because the movement dynamics are so different (and I love kayaking), and the group was into it, so Rylee started generating some water in the world as well.
![[Screenshot-2024-06-03-at-7.21.46PM.png]]
Meanwhle, Isaac and Carsten collaborated to create this very cool boat models in blender.
![[blender-rowboat-model.png]]

![[blender-model.png]]
I was inspired by the audio art that Rylee and Seamus had made and saw that this game would really need sound to come to life, so I started getting started on designing some sort of audio landscape.

At first I jumped to the first popular npm library I could find (npm is a package manager, allowing javascript program's to import and install popular utility libraries from the greater community)