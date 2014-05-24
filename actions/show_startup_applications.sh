#!/bin/bash

echo "----> Show all hidden startup applications..."

sudo sed -i "s/NoDisplay=true/NoDisplay=false/g" /etc/xdg/autostart/*.desktop