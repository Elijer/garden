---
title: Quartz
tags:
  - guide
  - obsidian
  - quartz
publish: true
---
I was telling my brother about this complicated blogging website I wanted to build from scratch using firebase and Next.js and he said the sensible thing which was, why not use something that already exists so you can start blogging today instead of like, months in the future if ever?

Actually, he was more specific. He knew I used a note management tool (and really this entire ecosystem) called Obsidian. He wondered if there was an easy way to host an obsidian vault - essentially, take the way I already preferred to take my notes, and just host THAT online rather than creating some entirely new knowledge management system.

# Obsidian
This is what it looks like to create this page in Obsidian:
![[obsidian.png]]

Turns out this is very doable! There seem to be a few amazing individuals who have created ways to do this. My favorite that I've found is Quartz.

I was initially introduced to it by [Brandon Boswell](https://www.youtube.com/watch?v=ITiiuBNVue0)s videos. I tried following along, but the video was made in 2022 and it's currently 2024, and either some of the steps are a little too out of date or his system is simply way more complicated than I need. What I found was that Quartz has excellent documentation and if followed, it basically did everything I needed to do.

I was really impressed by it, especially by:
- Very fast full text search
- Popovers on links
- Even an inclusion of Obsidian's really cool graph interface of notes as connected "nodes" in a web!
- A bunch of other very thoughtful ways of allowing other people to interact with and explore your notes online

Jackie Zhao (the creator) also included really thorough instructions for how to host it.

[Here is a slide deck I made on this subject](https://docs.google.com/presentation/d/1HjHMMQKTTBXssgJJJ18iAJ-7NLZbyfE57Tye1mL_giM/edit?usp=sharing)with some pretty sweet midjourney images of various animals astronauts.

# Setup Quartz (Brief)
1. [fork this](https://github.com/jackyzha0/quartz) and clone it locally with `git clone <the address of your new forked repo>`
2. `cd` into your new local repo and run `npm i`
3. run `npx quartz create` if you want help populating your content folder - you can also do this manually in any way you wish, just make sure there is an `index.md` file in the directory you end up serving with the...
4. `npx quartz build --serve` command, which also takes other flags, like `--directory` if you'd like to specifically a subdirectory inside your Obsidian Vault. You should be able to see your quartz site locally at `localhost:8080`!
5. Go to the `quartz.config.ts` file and change your `baseUrl` to whatever the baseUrl is going to be for your hosted site.
6. [Create a deploy.yaml file as instructed here](npx quartz build --serve) - make sure to save and commit it.
7. Head to your forked repo > settings > pages > Source and select `GithubActions`
8. Make sure you don't have some OTHER repo using your github page (at `your_github_username.github.io`), or this won't work
9. Run `npx quartz sync --no-pull`
10. Head to `your_github_username.github.io` and behold, your site!
11. Whenever you want to sync after this, just run `npx quartz sync`

# Setup Quartz (Verbose)

1. *Essentially*, follow the [getting started steps here](https://quartz.jzhao.xyz/), but I will be enriching them with my own instructions. For example, the instructions don't recommend forking and instead instruct the user to clone the repo and then change the `origin` remote manually, but then neglect to mention that you need to push a tag to your `origin`. Whereas if you fork it, none of that is necessary and there are fewer steps.
	Go to the [quartz repo](https://github.com/jackyzha0/quartz) and fork it
| Note: If you want to *practice* doing this, keep in mind you can only have one fork per repo per user, so you'll have to unfork your `practice` version when you do the final fork - possibly by cloning or deleting it. You can also clone the repo, but you need to make sure you get the upstream, origin, and tags all right (just make sure you have the v4 tag, which is used later on)

1. Clone your forked version of the repo locally
1. Run `npm i` to install all the `npm` modules needed
1. If you want any help populating some helpful starter content in your quartz project, copying your files from an existing Obsidian directory, or even symlinking them, run the `npx quartz create` utility and you will have an option to choose one of these options. I recommend using this utility and choosing the `Empty` option, which actually creates a sort of helpful `index.md` which has useful boilerplate, including minimal [frontmatter](https://quartz.jzhao.xyz/authoring-content). You can also choose to *not* use the `npx quartz create` utility which is fine - just keep an eye out for a message about creating an `index.md` file later on when you are building and serving your quartz repo. Without this index file, the main page of your quartz site will show a `404`.
2. We can try serving this thing locally now to make sure we're on the right track with `npx quartz build --serve`. You should see your site at the URL printed out! This could be a good time to tinker with the possibility of modifying the `quartz build -- serve` command with the `--directory` flag, which I have personally found useful to *only* build my public quartz blog out of *some* of my Obsidian vault. Like, it seemed nice to have a public and a private folder in the vault so I could easily drag stuff in and out of the public eye as needed while still allowing private stuff to reference public stuff. I will say that there are other ways to prevent certain vault documents and directories from getting deployed, [which are documented here](https://quartz.jzhao.xyz/features/private-pages). This can be achieved simply with, say, using `quartz build --directory content/public --serve`. Note that this is the same command that is eventually referenced inside the `deploy.yaml` file used for hosting, so if you add any flags like this to it, you'll have to change it in the `deploy.yaml` file as well to get that configuration on your hosted site. Or you could just add it to your `package.json` file as a command and reference that single command in both places to simplify your life.
3. This is a good time to open your `quartz.config.ts` file and read about the [configuration options available](https://quartz.jzhao.xyz/configuration). Perhaps notably, you're probably going to need to change your `baseUrl` config field to your hosting URL. Otherwise you're going to have issues with hosting. This field is going to be `"quartz.jzhao.xyz",` by default. Since I am hosting with Github Pages, then I changed mine to `"elijer.github.io"` for example. But checking out all your configuration options is probably going to be helpful in some way or another as a preemptive step to creating the quartz site you want.
4. Okay we're serving this thing locally, we've poked around in the config a bit, it's time to host. Before we do that, we have to make sure our changes are synced with github - this is because ultimately, to host, we're going to be deploying whenever we push to our github repo, so having that repo set up is the first step. The good news is that if you forked the repo instead of cloned it, you should already have a forked repo, which your local repo should point to as `origin`, while also still pointing to the official quartz repo as `upstream` so that you can always benefit from updates further down the road. That said, the `Setting up your GitHub repository` step on the quartz blog lists some steps you can take to make sure all this is in order. Simply run `npx quartz sync --no-pull` to do the initial push of your content to your repository.
5. The Quartz documentation outlines [a few different hosting options](https://quartz.jzhao.xyz/hosting) - after all, it produces a static bundle of HTML, CSS and javascript that be served directly to the browser - but this guide will be focusing on GitHub pages, mostly because it's free.
1. Create a new file here: `quartz/.github/workflows/deploy.yml` with this content, and don't forget to save and commit this new file, or the action won't run when you sync!
```
name: Deploy Quartz site to GitHub Pages
 
on:
  push:
    branches:
      - v4
 
permissions:
  contents: read
  pages: write
  id-token: write
 
concurrency:
  group: "pages"
  cancel-in-progress: false
 
jobs:
  build:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0 # Fetch all history for git info
      - uses: actions/setup-node@v3
        with:
          node-version: 18.14
      - name: Install Dependencies
        run: npm ci
      - name: Build Quartz
        run: npx quartz build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: public
 
  deploy:
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```
10. Go to the settings on your forked repository (not for your account or anything else), head to the `Pages` section, and under `Source` select `Github Actions` instead of the default option, `Deploy from a Branch`. This just means that the github workflow in the previous step will be able to deploy to pages.
| Note: You can only have one github page at a time, so if you have another active this won't work until you get rid of that github action. If you suspect this is the case, go to the same section of settings for *that* repo, and you should be able to see if that's the case - there will be a message at the top that'll tell you that github pages is live if, in fact, it is.
11. Now just run `npx quartz sync` from within your local repo and this should deploy to your site, making it live at `<github-username>.github.io/<repository-name>` after a couple moments.
12. If anything isn't working, look for the linked text that says `View workflow runs` - if any actions were attempted in the deployment of your site, they should show up here. It also might just take a sec, and if you're impatient like me, you can see a job in progress (it probably will take a max of like 20 seconds)