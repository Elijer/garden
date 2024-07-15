---
publish: true
tags:
  - project
---
![[backpack.png]]
I was talking to a backpack designer and, being someone who carries a backpack almost everywhere, had a lot of questions. He told me about sending designs to a factory overseas and the communication process involved. I asked him what the trickiest part about that process was and if he could buy/build any technology, what would help the process go more smoothly.

David told me that if both he and his sample designer in Vietnam could wear a VR headset, see the other point at things, and annotate parts of a 3D design in front of them, that would save a lot of time - maybe weeks on the month.

This immediately sounded like a thrilling project to me to work on. It also sounded like a problem for which tools already existed, so I did a short search. I found something being heavily marketed to me called [Spline](https://spline.design/), which seemed very powerful, and did seem to have live collaboration capabilities. It seemed like if I sat down with David we might be able to find a way to use this. In any case, the first step was creating a 3D model, so I downloaded [Polycam](https://poly.cam/), one of many free Photogrammetry tools out there.

![[spline.png]]

> "**Photogrammetry** is the science and technology of obtaining reliable information about physical objects and the environment through the process of recording, measuring and interpreting photographic images and patterns of electromagnetic radiant imagery and other phenomena" - Wikipedia.

When I refer to photogrammetry, I'm referring to something slightly more than than Wikipedia entry above. I am referring to a process in which an object is photographed many times from many angles. The aggregated visual information across these pictures is then used to generate a 3D model with a mesh and textures.

I'm impressed by the lighting in Spline, and the fidelity of the model I created with Polycam in less than five minutes. Because Polycam is a free service, they cap the amount of photos they will analyze (150), and those photos were taken by a humble iPhone SE held by an amateur photogrammetrist. A professional photogrammetry model could be much more detailed.

I was *less* impressed by Spline's comment system, which didn't seem to allow me to make comments that were locked in space, or particularly easy to read.

Once I could see the model I created, the idea felt much more tangible, so I opened up my IDE and starting writing some code to see if I could at least render some pixels on a screen. I started with a simple file uploader that could take the 3D GLB files that Polycam creates.

![[upload_form.png]]

Then I installed middleware package called `multer` to serve some file storage from the server:

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

Then I created a post route that would take an upload and used websockets to broadcast the location of the newly uploaded file to all connected clients.

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

Then on the client, I used ThreeJS to render the file on the frontend:

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

The result is far from perfect, but for a day's work I'm happy with it!

<div class="video-container"> <video controls> <source src="https://thornberry-garden.s3.us-east-2.amazonaws.com/backpack.mov" type="video/mp4"> Your browser does not support the video tag. </video> </div>

In the javascript above, I am calculating the intersection between the user's mouse and the model, and then sending those coordinates to the server. What isn't clear from the video above is that on the server, those mouse updates are getting saved to an object of mouse updates associated with players, allowing players in theory to see the live cursor location of another user:

```javascript
socket.on('cursorPosition', (data) => {
	clients[data.playerId] = {...clients[data.playerId], ...data}
	socket.emit('cursors', clients)
});
```

This sort of worked. When I opened up two tabs of the project, it seemed like the javascript execution was paused until that window was active. This made it hard to tell how it would behave if two people opened it on separate machines.

> This behavior isn't consistent with another [[Eco Mog |websocket project of mine]], making me wonder if there's an issue with my websocket logic

I went ahead and deployed it so I could try to test this functionality between my computer and my phone.

Once I deployed, I realized that for my server's file server to work, I needed to configure a Docker volume. This should be pretty easy in theory, but I also realized I hadn't thought through the file storage at all when jumping in, and I had some pretty basic questions about what architecture to go with:
- Should I save the files on the server, or use a file storage platform like S3?
- What is the ideal user flow of file uploading? If the files are all there, should there be a directory of active projects, or should users get redirected to a route for every newly uploaded 3D model?

Much of the Sunday was gone at this point. It seemed like a good time to pause and go on a bike ride, so I left these questions for a later time.

With websockets and careful spatial math, I could build this into a useful object annotation tool. While working on it, I realized that the things I would like to improve are:

- Use routing so that links can be created for multiple 3D objects
- persist those objects in storage
- persist the comments about them, too, in a database
- Route socket activity into distinct "rooms" so that different conversations can happen about different objects simultaneously

**Next.JS** paired with **Firebase Storage** and **Supabase** or **Firestore** would be a fast way to get V2 up and running.

As far as solving the problem I set out to solve, I would like to spend more time with existing tools. But if I find an existing tool that works for David, it will still be tempting to create this because of how fun the challenge of working with multiplayer data is.