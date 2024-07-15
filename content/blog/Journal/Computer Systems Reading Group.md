# The Group Itself
Has been going for 35 weeks
REDIS is the most popular in-memory database in the world
That's what we're reading about this week!

Most people that have showed up this week:
Theory *last* week was really good

This week we are reading source code of Redis 1.3.6, which is when it was sort of "done" - 2010
7.2.0 - 2024
It's been 14 years!
Wonder what would happen if we diffed it

# REDIS
Run a redis server exposed to 6379
install redis CLI
run commads to do stuff

**Popular Uses**
Rate limiting
Caching
Backend storage for message queues (does that mean it's also used to implement)
Sessions -  user sessions, does this count as caching?

virtual memory
abstract memory as an OS, instead of creating an object malloc, the OS needs to decide what part of memory to put that in
the reason you want contigous blocks of memory is

# Observations
REDIS implemented its own virtual memory system, which is something OS's do
- Does this mean REDIS overrides the OS VM system, or this code was simply written before they could be depended on?
This explains a lot about virtual memory:
https://redis-doc-test.readthedocs.io/en/latest/topics/virtual-memory/

Also, Redis' VM system is now depricated
- Why?

```
 vm-max-memory
```

**What are pages in virtual memory**
A fixed-length contiguos block of virtual memory, described by a single entry in a page table. It is the smalest unit of data for memory management in a OS that uses virtual mem.

# Thoughts
Woah looking through the redis.c file makes me think
- I need to get better at string queries
- 