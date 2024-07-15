---
publish: true
tags:
  - project
---
# Building a 3D Multiplayer Annotation Tool with Websockets and ThreeJS

![[backpack.png]]
> This is a screenshot of this project - you can see a video of it below

I met a backpack designer named David Eisenberg this week. I'm someone who carries a backpack with me whenever I venture farther than a couple of blocks from home, so I had a lot of questions. I am also someone who has sewed together enough bike frame bags (2!) to imagine how much I didn't know on the subject.

David told me about sending design documents to factories overseas, mostly in Vietnam, and the extensive back-and-forth involved. Following my human urge to insert myself in someone else's business in any way possible, I asked him, "if you could buy/build any technology, what would help the process go more smoothly?"

David related emphatically that if both he and the sample designers he talked to could wear a VR headset, see the other point at things, and annotate parts of a 3D design in front of them, that would save a lot of time - maybe weeks on the month.

As a software engineer, this immediately sounded thrilling. Real-time interaction, 3D models.

But it *also* sounded like a problem for which tools already existed, so I did a short search. I found something being heavily marketed to me called [Spline](https://spline.design/), which looked feature-rich, and *did* seem to have live collaboration capabilities. After trying it out, it seemed likely that after sitting down with David we might be able to find a way to use it. In any case, the first step was creating a 3D model, so I downloaded [Polycam](https://poly.cam/) onto my phone, one of many free Photogrammetry tools out there, and got to work snapping photos.

![[spline.png]]
> A live view of a photogrammetry-generated model in Spline's web app

> "**Photogrammetry** is the science and technology of obtaining reliable information about physical objects and the environment through the process of recording, measuring and interpreting photographic images and patterns of electromagnetic radiant imagery and other phenomena" - Wikipedia.

When I refer to photogrammetry, I mean something slightly more specific than the Wikipedia definition above. I am referring to a process in which an object is photographed many times from many angles. The aggregated visual information across these pictures is then used to generate a 3D model with a mesh and textures.

I'm impressed by the lighting in Spline, and the fidelity of the model I created with Polycam in less than five minutes. Because Polycam is a free service, they cap the amount of photos they will analyze (150), and those photos were taken by a humble iPhone SE held by an amateur photogrammetrist. A professional photogrammetry model could be much more detailed.

I was *less* impressed by Spline's comment system, which didn't seem to allow me to make notes that were anchored in space or clearly referring to points on a model.

With the model in front of me, the idea felt much more tangible, so I opened up my IDE and starting writing some code to see if I could at least render some pixels on a screen. I started with a simple file uploader that could take the 3D GLB files that Polycam creates.

---
# The Code

![[upload_form.png]]

It sent off the uploaded files to a middleware package I installed with `npm` called `multer`, allowing me to serve some file storage directory from the server:

```javascript
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/');
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname));
	}

});
```

Next, I created a post route that would take an upload and used websockets to broadcast the location of the newly uploaded file to all connected clients.

```javascript
app.post('/upload-3d-model', upload.single('file'), (req, res) => {

	if (!req.file)return res.status(400).json({ error: 'No file uploaded' });

	const fileExtension = path.extname(req.file.originalname).toLowerCase();
	
	if (fileExtension !== '.gltf' && fileExtension !== '.glb'){
		return res.status(400).json({
			error: 'Invalid file type. Only GLTF and GLB files are allowed.'
		});
	}
	
	res.json({
		message: '3D model file uploaded successfully',
		fileUrl: `http://localhost:3000/uploads/${req.file.filename}`;
	});

	io.emit('modelUploaded', { fileUrl });

});
```

Finally on the client, I used ThreeJS to render the file on the frontend:

```javascript
async function renderGLB(fileUrl) {
	const loader = new GLTFLoader();
	loader.load(fileUrl, (gltf) => {
		scene.add(gltf.scene);
		camera.position.set(0.08, 1.2, .7);

		// Raycaster for detecting cursor position on the model
		const raycaster = new THREE.Raycaster();
		const mouse = new THREE.Vector2();

		let lastEmitTime = 0;
		const emitInterval = 10

		function onMouseMove(event) {
		
			mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
			mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
			raycaster.setFromCamera(mouse, camera);
		
			const intersects = raycaster.intersectObject(gltf.scene, true);

			if (intersects.length > 0) {
				const intersect = intersects[0];
				const currentTime = Date.now();

			if (currentTime - lastEmitTime >= emitInterval){
				socket.emit('cursorPosition', {
					playerId: playerId,
					x: intersect.point.x,
					y: intersect.point.y,
					z: intersect.point.z
				});

				lastEmitTime = currentTime;
			}
		}
	}


	window.addEventListener('mousemove', onMouseMove, false);

  

	const animate = function () {
		requestAnimationFrame(animate);
		controls.update(); // Update controls
		renderer.render(scene, camera);
	};
	
	animate();

}
```
> There is much more code than these three examples, but hopefully these tell most of the story

---
# The Result
It's miles from the fully realized vision, but for a day's work I'm happy with this is a prototype!

<div class="video-container"> <video controls> <source src="https://thornberry-garden.s3.us-east-2.amazonaws.com/backpack.mov" type="video/mp4"> Your browser does not support the video tag. </video> </div>

In the JavaScript above, I calculate the intersection between the user's mouse and the model. Then I send those coordinates to the server. What isn't clear from the video above is that on the server, those mouse updates are getting saved to an object of mouse updates associated with players, allowing players, in theory, to see the live cursor location of another user:

```javascript
socket.on('cursorPosition', (data) => {
	clients[data.playerId] = {...clients[data.playerId], ...data}
	socket.emit('cursors', clients)
});
```

This...sort of worked. When I opened up two tabs of the project, it seemed like the javascript execution was paused until that window was active. This made it hard to tell how it would behave if two people opened it on separate machines.

> This behavior isn't consistent with another [[Eco Mog |websocket project of mine]], making me wonder if there's an issue with my websocket logic.

I went ahead and deployed it so I could try to test this functionality between my computer and my phone.

---
# Deployment

Once I deployed, I realized that for my server's file server to work, I needed to configure a Docker volume. This should be pretty easy in theory, but I also realized that I was so excited to jump into the project, I hadn't really thought about the best file storage solution. When I considered this, I discovered some pretty basic questions about what architecture to go with:
- Save the files on the server, or use a file storage platform like S3?
- How should I direct users to various files? Should I start with one global file, since it's just a prototype? Or create a route for each new file? If so, is it necessary to display a directory of uploaded files, or just let users save the URL somewhere for now?

Much of the Sunday was gone at this point. Like it often does, it seemed twenty minutes past the ideal moment to pause and go on a bike ride, so I closed my laptop and left these questions for a later time.

---
# Reflections

With websockets and careful spatial math, I could build this into a useful object annotation tool. While working on it, I realized that the things I would like to improve are:

- Use routing so that links can be created for multiple 3D objects
- persist those objects in storage
- persist the comments about them, too, in a database
- Route socket activity into distinct "rooms" so that different conversations can happen about different objects simultaneously

**Next.JS** paired with **Firebase Storage** and **Supabase** or **Firestore** would be a good stack to get V2 up and running.

As far as solving the problem I set out to solve, I would like to spend more time with existing tools. But if I find an existing tool that works for David, it will still be tempting to create this because of how fun the challenge of working with multiplayer data is!

I had a conversation with a pair of entrepreneurs the other day, and one of them brought up a good question that's worth pondering for any project in danger of taking longer than a Sunday:

"Did this exist two years ago? If not, why?"

Thanks for reading!