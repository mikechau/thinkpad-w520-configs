# Install

1. z - https://github.com/rupa/z.git
2. bash history - https://coderwall.com/p/oqtj8w
3. `~/.bashrc` - `export PROMPT_DIRTRIM=1`

# Applications

1. Yakuake
2. Pidgin
3. Skype
4. Hexchat
5. Dropbox
6. Virtualbox
7. Vagrant
8. Redshift
9. Sublime
10. Atom
11. Tmux

# Tweaks

1. login shell - http://askubuntu.com/questions/132276/configure-gnome-terminal-to-start-bash-as-a-login-shell-doesnt-read-bashrc

2. set swappiness to 10 - `sudo gedit /etc/sysctl.conf`

3. tmp to ram - `tmpfs /tmp tmpfs defaults,noexec,nosuid 0 0`

4. fstab edits

```
tmpfs /home/mike/.cache/mozilla/firefox/xkl2ihmg.default/Cache  tmpfs   mode=1777,noatime 0 0
tmpfs /home/mike/.cache/chromium/Default/Cache                  tmpfs   mode=1777,noatime 0 0
tmpfs /home/mike/.cache/chromium/Default/Media\040Cache         tmpfs   mode=1777,noatime 0 0
tmpfs /home/mike/.cache/google-chrome/Default/Cache             tmpfs   mode=1777,noatime 0 0
tmpfs /home/mike/.cache/google-chrome/Default/Media\040Cache    tmpfs   mode=1777,noatime 0 0
tmpfs /home/mike/.cache/nuvolaplayer/browser                    tmpfs   mode=1777,noatime 0 0
tmpfs /home/mike/.adobe/Flash_Player/NativeCache                tmpfs   mode=1777,noatime 0 0
tmpfs /home/mike/.adobe/Flash_Player/AssetCache                 tmpfs   mode=1777,noatime 0 0
tmpfs /home/mike/.macromedia                                    tmpfs   mode=1777,noatime 0 0

```

# Cinnamon applets
`~/.local/share/cinnamon/applets`

1. system monitor
  - `sudo apt-get install gir1.2-gtop-2.0`
  - `sudo apt-get install gir1.2-networkmanager-1.0`
2. network monitor
  - `sudo apt-get install gir1.2-gtop-2.0`
3. windows 7 taskbar
4. cpu freq