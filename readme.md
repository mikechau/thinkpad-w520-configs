# Lenovo Thinkpad W520 config scripts

Maybe someday I will convert all this into a puppet or chef...but until that day here is a bunch of shell scripts. You are welcome and encouraged to convert all this into puppet or chef and do a pull request. ;)

NOTE: These scripts are pretty buggy and probably don't work properly as intended. Use them at your own risk or more as a baseline/guide for what you could do. Some of the order is also incorrect, maybe I will fix it at a later time.

## Folder Structure
```
.
├── actions
├── apply
├── configs
│   └── etc
│       └── adobe
├── dependencies
│   ├── extras
│   └── initial
│   └── post
│   └── thinkpad
├── fixes
├── remove
└── system

```

- `actions`: contain specific actions to trigger
- `apply`: contain scripts that copy configs
- `configs`: config files that are to be applied
- `dependencies`: packages that need to be installed
- `fixes`: tweaks or settings
- `remove`: packages that get removed
- `system`: system related, kernel, drivers, etc

## What these scripts do

1. Update the kernel to the latest
  - Reason: Ideally a newer kernel gives us better compatibility with the nvidia prime

2. Update nvidia drivers to xorg edgers
  - Reason: It's all packaged up and updates are easy

3. Installs Flash w/ HW Acceleration

4. Installs Cinnamon and Removes Unity

## Getting Started

1. Install [Ubuntu 14.04 LTS][1]
  - Select no updates
  - Select no third party plugins

[1]: http://www.ubuntu.com/download/desktop
