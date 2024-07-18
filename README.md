# Personal Blog
This is my personal blog, a deployment of Obsidian to static site using the Quartz framework.

# Submodule Deployment System
Okay so all of my content is in a submodule.

For the `npm run blog` command, I'm simply linking to the directory on a separate place on my disk, locally.
For the `npm run deploy` command, I'm pushing the submodule to the remote repository. But I'm ALSO updating locally beforehand, because the `npx quartz sync` command seems to require it. However, I also went to the trouble of building the submodule in the deploy.yaml and passing it special SSH keys so that it can read the private repo, and that seemed to be necessary, so I think it's just CHECKING locally. I guess there's an easy way to test - 
I can update the submodule, but NOT update those local files. Then, I can push. If I see the most recent changes, it's because I just need an empty folder essentially to pass the check (or I could even modify the check to make sure the SUBMODULE has the specified folder of content/blog, which would make more sense.)