---
title: Crontab
tags:
  - shell-scripting
publish: true
---
> I will leave this up but I didn't totally get this working. I got a test working in which I was printing a log message every x amount of time, but what I really wanted to do was run the command `npx quartz sync` and although it ran fine with `source thatscript.sh`, it did not run correctly in the cronjob. The only theory I had left was that the $PATH in the crontab environment is different from that of my normal command-line environment.

There is apparently a program in mac called crontab! It's really simple to use.

1. Create a `.crontab` file in your user/home directory.
2. Put a crontab command in, like * * * * * /path/to/your/script.sh
3. Whatever script you direct this command to will run as specified
4. Probably just put the script in your `$HOME/bin` directory. Make sure your `$HOME/bin` directory is in your `$PATH`.

Cron is format that specifies when a job should run.
`* * * * *` is a job that runs every minute
`0 6 * * *` would run every day at 6am.

Set permissions to that script with`chmod +x /path/to/your/script.sh`

Now tell `crontab` what file to use. Just hop over to your home directory and execute `crontab .crontab`. You may have to prefix this with `sudo`. You always may have to accept to a dialog box by your OS asking if you trust `Terminal` or whatever is running your shell to manipulate your operating system

> WARNING: Causing a script to run every x minutes or hours can definitely be dangerous - make sure you know what the script does. And also that you are sure how frequently you are running it, and that frequency is going to be okay. If you intend to run a script that runs once every week, maybe briefly consider, what would happen if this ran every minute?

You can check any active jobs with `crontab -l`.

Das it! You now hopefully have a script running on schedule for you. Mine just published this article, I hope.

Okay maybe....now???