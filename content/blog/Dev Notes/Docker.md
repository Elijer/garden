Install docker:
```
brew install docker
```

Install the desktop app:
https://docs.docker.com/desktop/install/mac-install/

Hello World 0: print "hello world" to console with the correct version
Hello world: displaying a point cloud within a jupiter notebook using open3D

Some useful commands for doing this:
```
docker build .
docker build . -t <some-tag-name>
docker image ls
docker run -i -t test1:latest
```



# Shortcomings
Although you get a totally isolated environemnet with repeatable setup commands, your dev environment and tooling then need to be set up separately to replicate that environment.
