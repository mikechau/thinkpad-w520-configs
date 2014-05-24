#!/bin/bash
# update kernel

echo "----> Updating the kernel..."

cd /tmp

wget kernel.ubuntu.com/~kernel-ppa/mainline/v3.14.4-utopic/linux-headers-3.14.4-031404_3.14.4-031404.201405130853_all.deb

wget kernel.ubuntu.com/~kernel-ppa/mainline/v3.14.4-utopic/linux-headers-3.14.4-031404-generic_3.14.4-031404.201405130853_amd64.deb

wget kernel.ubuntu.com/~kernel-ppa/mainline/v3.14.4-utopic/linux-image-3.14.4-031404-generic_3.14.4-031404.201405130853_amd64.deb

sudo dpkg -i linux-headers-3.14.4-*.deb linux-image-3.14.4-*.deb

echo "KERNEL UPDATED YOU SHOULD RESTART!"