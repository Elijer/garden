So before the official voice interface for ChatGPT came out, I wanted to make one, and I gave it a shot. I was able to create a voice interface (using the text to speech API on all browsers) where you can start a conversation with a unique sounding word like "asparagus" and end it too, which would run voice to text and send that text to the ChatGPT endpoint. Then I would take what the ChatGPT endpoint generated and send that to a text-to-speech service called Eleven Labs to create an MP3 of that text being spoken. There was a lot of latency, because one service needed to run, then another. I realized that with streams, I could really pipe each piece to the other, making the latency much more negligible. I didn't get to that point though.

Now, using the ChatGPT voicebot, I find the experience really interesting. It's close enough to a real human conversation that I can't help drawing paralells, but there are so many small interesting details and experiences to it:
- I feel compelled to answer the voicebot's questions
- I feel somewhat rushed, knowing that too long of a silence will prompt the voicebot to jump in and respond, which is both similar to and different from human conversations
- I know that the voicebot will complete it's conversational contract in a very thorough way, which is kind of nice because everything I am saying is being responded to, but also not so great because it's a really "heavy conversation"
- Although the vocal interface is mostly hands-free, to interrupt or pause, it *is* necessary to tap on icons on the screen.


I think there are some directions that would be fun to pursue here like, exploring silence, and slower paced conversations