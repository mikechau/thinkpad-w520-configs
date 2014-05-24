#!/bin/bash

echo "----> Installing tpkbdctl..."

sudo apt-get install python-pip
sudo pip install tpkbdctl

echo "now configure it..."
echo "https://github.com/bseibold/tpkbdctl"