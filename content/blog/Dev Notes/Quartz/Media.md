---
title: Photos in Quartz
tags:
  - photography
  - plan
publish: true
---
# The Goal
I want to find a way to easily link photos without using up my Quartz storage, since I sort of want to sync my quartz notes with my phone at some point. Not there yet though. Here are the options I've found so far.

# Google Photos Plugin
I did find [this guys google photos plugin] which looks interesting. The setup will take some time I don't currently have though, so I will return to this.

# Google Drive
Seems like this could be really doable, especially with the desktop app, but it doesn't seem like I can host images with google drive easily - it's not like an image hosting service I guess.

# S3
I found that just making a public S3 bucket for videos is working pretty well. This was necessary immediately since github has a 100mb file limit and also...really doesn't like uploading large media files. If you accidentally manage to get a 100mb file cached in github, it's a huge pain to remove it. You can use a tool called `git-filter-repo` to remove those cached files.

Anyways, once uploading videos to S3 (which is faster than youtube, and at least in quartz, styles much more cleanly right out of the box) you can include those files with these simple video tags:

```html
<div class="video-container">
	<video controls>
	<source src="https://thornberry-garden.s3.us-east-2.amazonaws.com/Moss2.mp4" type="video/mp4">
	Your browser does not support the video tag.
	</video>
</div>
```