---
publish: true
title: 
How to Build Multiplayer Games: MOGs
tags:
  - mog
---
> MOG: Multiplayer Online Game

# Resources
 - [What are CRDTs?](https://jakelazaroff.com/words/an-interactive-intro-to-crdts/)
-  [Development & Deployment of Multiplayer Online Games Vol. I](https://leanpub.com/development-and-deployment-of-multiplayer-online-games-vol1)
  
# Connection Protocols
There are two major connection protocols
- TCP (super commonly used on the internet, very reliable)
- UDP (less commonly used because it's less reliable, but faster)

It sounds like TCP comes with a lot of support out of the gate like:
- error checking and correction
- monitoring the loss of data packets

And these are generally things that need to be built from scratch when implementing UDP. However, TCP has some major drawbacks, like being slower and still requiring a good deal of custom logic to handle dropped connections.

Ultimately, TCP - and by extensions, the socket.io library - should be fine for my purposes at first but if I really need higher performance (that I can quantify and therefore justify) then using UDP might be a good option in the future.

AND IF IT IS the lack of support with UDP may be less of an issue than it once was. Here is a [Hackernoon article about making UDP more reliable](https://hackernoon.com/unity-realtime-multiplayer-part-3-reliable-udp-protocol)

