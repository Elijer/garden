# Personal Blog
This is my personal blog, a deployment of Obsidian to static site using the Quartz framework.

# Submodule Deployment System
Okay so all of my content is in a submodule.

For the `npm run blog` command, I'm simply linking to the directory on a separate place on my disk, locally.
For the `npm run deploy` command, I'm pushing the submodule to the remote repository. But I'm ALSO updating locally beforehand, because the `npx quartz sync` command seems to require it. However, I also went to the trouble of building the submodule in the deploy.yaml and passing it special SSH keys so that it can read the private repo, and that seemed to be necessary, so I think it's just CHECKING locally. I guess there's an easy way to test - 
I can update the submodule, but NOT update those local files. Then, I can push. If I see the most recent changes, it's because I just need an empty folder essentially to pass the check (or I could even modify the check to make sure the SUBMODULE has the specified folder of content/blog, which would make more sense.)

Welp I just tried that and it didn't seem to work. I should probably double check where I'm less tired.

Anyways, this is what I WANT to happen - 
I want to create an Obsidian plugin that just pushes any changes that I've made in obsidian FROM obsidian. I'd like to bind a hotkey to it even.

This will trigger the quartz app to be rebuilt, and I guess a git commit on the submodule, possibly automating a commit. It will also trigger a rebuild of the parent module, even though no changes are being made on github.

This won't necessarily work the way things are now though. Or well, maybe it will? The parent repo seems to kind of know that it's different when it's child changes, so maybe that would work. I could just commit...both? If that's how it works? From the obsidian plugin?

The whole point of this was to prevent there from being changes to the parent though, so if a commit is needed in the parent for a deploy to happen, that defeats the purpose. I can change the action to run based on some other event, like the submodule changing I guess. That would work. Maybe there's a way to have the submodule trigger the parent to build.

So it would be like this
change to obsidian > obsidian plugin commits it, possibly an automated commit > this triggers the parent module to rebuild and deploy but NOT make any commits to version control > the deployment is built with the new submodule content.

And all the while, the submodule is in its own folder somewhere, and the parent module is in its own folder, and there IS another element where the `npm run blog` command needs to point to the directory of a local submodule, but that's fine.

I think I could build this!

HOWEVER

There may be an easier way that just has to do with the submodule being nested inside of the same local folder as its parent. Sort of confuses me why this would be necessary or how this would work though.

////