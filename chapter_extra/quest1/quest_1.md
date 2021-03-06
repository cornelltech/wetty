# Quest 1 #
This is a training mission.

A hacker has managed to infect your computer with a malware.
The malware might destroy your files and infect other machines.

Once you login to your computer, you have 5 minutes to desactivate the malware.

The hacker was a little sloppy and left some traces behind.

1. From the current folder, look for a file named `footsteps.txt`.

2. Read the content of the file to find out the pid of the process running the malware.

3. Terminate the process using the `kill` command.

4. The malware process is being run as a different user. You need to impersonate the user in order to terminate the process. To do so, you need  the password the hacker used. Look for a file `pwgen.txt`.

5. Impersonate the hacker.

6. Terminate the process.

You successfully completed your mission.

## Hints ##
- what's a malware?
- how do I find a file?
- how do I read the content of a file?
- what's a `pid`?
- how do I terminate a process?
- what does `Operation not permitted` mean?
- how do I impersonate a user?

## Page ingredients ##
The page should display the countdown, as output from the process running in the shell.
Once the process is killed, the coutdown should stop, like in the movies.

Once the user has successfully complete the mission, a nice reward.

## Shell ingredients ##
- a `hacker` user account
- a process running as `hacker` that does the countdown
- a few level-deep hierarchy of folders
- a file named `footsteps.txt` somewhere in this hierarchy
- a file named `pwgen.txt` somewhere in this hierarchy


