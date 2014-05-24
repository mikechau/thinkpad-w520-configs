#!/bin/bash

echo "----> Removing Unity..."

# Make nemo default
xdg-mime default nemo.desktop inode/directory application/x-gnome-saved-search
gsettings set org.gnome.desktop.background show-desktop-icons false
gsettings set org.nemo.desktop show-desktop-icons true

# remove unity
sudo apt-get autoremove --purge unity unity-common unity-services unity-lens-\* unity-scope-\* unity-webapps-\* gnome-control-center-unity hud libunity-core-6\* libunity-misc4 libunity-webapps\* appmenu-gtk appmenu-gtk3 appmenu-qt\* overlay-scrollbar\* activity-log-manager-control-center firefox-globalmenu thunderbird-globalmenu libufe-xidgetter0 xul-ext-unity xul-ext-webaccounts webaccounts-extension-common xul-ext-websites-integration gnome-control-center gnome-session

sudo rm /usr/lib/thunderbird-addons/extensions/messagingmenu@mozilla.com.xpi

sudo apt-get autoremove --purge compiz compiz-gnome compiz-plugins-default libcompizconfig0

sudo apt-get autoremove --purge nautilus nautilus-sendto nautilus-sendto-empathy nautilus-share

# remove configs
rm -rf ~/.local/share/unity-webapps
rm -rf ~/.compiz
rm -rf ~/.config/compiz-1
rm -rf ~/.config/nautilus
rm -rf ~/.local/share/nautilus

# remove gnome screensaver
sudo apt-get purge --remove gnome-screensaver

# restore shotwell
sudo apt-get install shotwell

# remove un-needed applications
sudo apt-get purge --remove rhythmbox
sudo apt-get purge --remove webbrowser-app
